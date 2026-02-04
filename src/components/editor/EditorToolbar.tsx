'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Square,
  Type,
  Image as ImageIcon,
  Undo,
  Redo,
  Download,
  Layers,
  Group as GroupIcon,
  Ungroup as UngroupIcon,
  MousePointer2,
  Circle,
  FileDown,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { undo, redo, addElement, setSelectedIds, toggleLayers, groupSelected, ungroupSelected } from '@/redux/features/editorSlice';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ICON_LIBRARY } from '@/config/icon-library';
import jsPDF from 'jspdf';
import ThemeToggle from '../ThemeToggle';

export const EditorToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const showLayers = useAppSelector((state) => state.editor.showLayers);
  const selectedIds = useAppSelector((state) => state.editor.selectedIds);
  const elements = useAppSelector((state) => state.editor.elements);

  const canGroup = selectedIds.length > 1;
  const firstSelectedId = selectedIds[0];
  const canUngroup = selectedIds.length === 1 && firstSelectedId && elements[firstSelectedId]?.type === 'group';

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const addText = () => {
    const newText = {
      id: `text-${Date.now()}`,
      type: 'text' as const,
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      rotation: 0,
      opacity: 1,
      text: 'New Text Block',
      fontSize: 20,
      fontFamily: 'Inter',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: '',
      fill: '#000000',
      align: 'left' as const,
    };
    dispatch(addElement(newText));
  };

  const addShape = (shapeType: 'rectangle' | 'circle') => {
    const newShape = {
      id: `${shapeType}-${Date.now()}`,
      type: 'shape' as const,
      shapeType,
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
      fill: '#3b82f6',
      stroke: '#2563eb',
      strokeWidth: 0,
    };
    dispatch(addElement(newShape));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const newImage = {
        id: `image-${Date.now()}`,
        type: 'image' as const,
        src,
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        rotation: 0,
        opacity: 1,
      };
      dispatch(addElement(newImage));
    };
    reader.readAsDataURL(file);
  };

  const addIcon = (iconName: string) => {
    const newIcon = {
      id: `icon-${Date.now()}`,
      type: 'icon' as const,
      name: iconName,
      x: 200,
      y: 200,
      width: 60,
      height: 60,
      rotation: 0,
      opacity: 1,
      fill: '#000000',
    };
    dispatch(addElement(newIcon as any));
  };

  const exportAsImage = () => {
    dispatch(setSelectedIds([]));

    setTimeout(() => {
      const stage = (window as any).konvaStage;
      if (!stage) return;

      const dataURL = stage.toDataURL({ pixelRatio: 3, mimeType: 'image/png' });
      const link = document.createElement('a');
      link.download = 'business-card-design.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Exported as PNG', {
        description: 'File: business-card-design.png'
      });
    }, 100);
  };

  const exportAsPDF = () => {
    dispatch(setSelectedIds([]));

    setTimeout(() => {
      const stage = (window as any).konvaStage;
      if (!stage) return;

      const dataURL = stage.toDataURL({ pixelRatio: 2 });
      const pdf = new jsPDF('l', 'px', [600, 350]);
      pdf.addImage(dataURL, 'PNG', 0, 0, 600, 350);
      pdf.save('business-card-design.pdf');
      toast.success('Exported as PDF', {
        description: 'File: business-card-design.pdf'
      });
    }, 100);
  };

  return (
    <div className="h-14 border-b border-muted bg-card px-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-muted rounded-md p-1 mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-background shadow-sm">
            <MousePointer2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", showLayers && "bg-accent text-accent-foreground")}
            onClick={() => dispatch(toggleLayers())}
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 mx-2" />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={addText}>
            <Type className="h-4 w-4" />
            Text
          </Button>

          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 gap-1" onClick={() => addShape('rectangle')}>
              <Square className="h-3.5 w-3.5" />
              Rect
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 gap-1" onClick={() => addShape('circle')}>
              <Circle className="h-3.5 w-3.5" />
              Circle
            </Button>
          </div>

          <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="h-4 w-4" />
            Image
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Star className="h-4 w-4" />
                Icon
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid grid-cols-6 gap-2">
                {Object.keys(ICON_LIBRARY).map((name) => (
                  <Button
                    key={name}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 p-2 hover:bg-muted"
                    onClick={() => addIcon(name)}
                    title={name}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d={ICON_LIBRARY[name]} />
                    </svg>
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator orientation="vertical" className="h-8 mx-2" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => dispatch(groupSelected())}
            disabled={!canGroup}
            title="Group (Ctrl+G)"
          >
            <GroupIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => dispatch(ungroupSelected())}
            disabled={!canUngroup}
            title="Ungroup (Ctrl+Shift+G)"
          >
            <UngroupIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => dispatch(undo())}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => dispatch(redo())}>
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportAsImage} className="gap-2">
              <Download className="h-4 w-4" />
              Download as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportAsPDF} className="gap-2">
              <FileDown className="h-4 w-4" />
              Download as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-8 mx-2" />

        <ThemeToggle />
      </div>
    </div>
  );
};

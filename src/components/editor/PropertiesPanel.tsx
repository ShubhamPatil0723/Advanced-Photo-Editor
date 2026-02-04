'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { updateElement } from '@/redux/features/editorSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const PropertiesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.editor.elements);
  const selectedIds = useAppSelector((state) => state.editor.selectedIds);

  const selectedId = selectedIds[0];
  const selectedElement = selectedId ? elements[selectedId] : undefined;

  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <p className="text-sm text-muted-foreground italic">
          Select an element to edit properties.
        </p>
      </div>
    );
  }

  const handleChange = (val: any) => {
    dispatch(updateElement({ id: selectedElement.id, ...val }));
  };

  return (
    <div className="flex flex-col gap-6 p-4 pb-20">
      {/* Position & Size */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">X Position</Label>
          <Input
            type="number"
            value={Math.round(selectedElement.x)}
            onChange={(e) => handleChange({ x: Number(e.target.value) })}
            className="h-8 text-xs px-2"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Y Position</Label>
          <Input
            type="number"
            value={Math.round(selectedElement.y)}
            onChange={(e) => handleChange({ y: Number(e.target.value) })}
            className="h-8 text-xs px-2"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Width</Label>
          <Input
            type="number"
            value={Math.round(selectedElement.width)}
            onChange={(e) => handleChange({ width: Number(e.target.value) })}
            className="h-8 text-xs px-2"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">Height</Label>
          <Input
            type="number"
            value={Math.round(selectedElement.height)}
            onChange={(e) => handleChange({ height: Number(e.target.value) })}
            className="h-8 text-xs px-2"
          />
        </div>
      </div>

      <Separator />

      {/* Rotation & Opacity */}
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Rotation</Label>
            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">{Math.round(selectedElement.rotation)}°</span>
          </div>
          <Slider
            value={[selectedElement.rotation]}
            min={0}
            max={360}
            step={1}
            onValueChange={([val]) => handleChange({ rotation: val })}
          />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Opacity</Label>
            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">{Math.round(selectedElement.opacity * 100)}%</span>
          </div>
          <Slider
            value={[selectedElement.opacity * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={([val]) => handleChange({ opacity: val! / 100 })}
          />
        </div>
      </div>

      {selectedElement.type === 'text' && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Text Content</Label>
              <Input
                value={selectedElement.text}
                onChange={(e) => handleChange({ text: e.target.value })}
                className="text-sm"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-[10px] text-muted-foreground uppercase font-bold">Font Size</Label>
                <span className="text-xs font-mono text-muted-foreground">{selectedElement.fontSize}px</span>
              </div>
              <Slider
                value={[selectedElement.fontSize]}
                min={8}
                max={120}
                step={1}
                onValueChange={([val]) => handleChange({ fontSize: val })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Color</Label>
              <input
                type="color"
                value={selectedElement.fill}
                onChange={(e) => handleChange({ fill: e.target.value })}
                className="w-10 h-6 rounded cursor-pointer p-0 border border-muted-foreground/20"
              />
            </div>

            <div className="flex gap-1 justify-between bg-muted/50 p-1 rounded-md">
              <Button
                variant={selectedElement.fontWeight === 'bold' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange({ fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={selectedElement.fontStyle === 'italic' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange({ fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={selectedElement.textDecoration === 'underline' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange({ textDecoration: selectedElement.textDecoration === 'underline' ? '' : 'underline' })}
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-4 my-2" />
              <Button
                variant={selectedElement.align === 'left' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange({ align: 'left' })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={selectedElement.align === 'center' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange({ align: 'center' })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={selectedElement.align === 'right' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange({ align: 'right' })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {selectedElement.type === 'shape' && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Fill Color</Label>
              <input
                type="color"
                value={selectedElement.fill}
                onChange={(e) => handleChange({ fill: e.target.value })}
                className="w-10 h-6 rounded cursor-pointer p-0 border border-muted-foreground/20"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Stroke Color</Label>
              <input
                type="color"
                value={selectedElement.stroke}
                onChange={(e) => handleChange({ stroke: e.target.value })}
                className="w-10 h-6 rounded cursor-pointer p-0 border border-muted-foreground/20"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] text-muted-foreground uppercase font-bold">Stroke Width</Label>
                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">{selectedElement.strokeWidth}px</span>
              </div>
              <Slider
                value={[selectedElement.strokeWidth]}
                min={0}
                max={20}
                step={1}
                onValueChange={([val]) => handleChange({ strokeWidth: val })}
              />
            </div>
          </div>
        </>
      )}

      {selectedElement.type === 'icon' && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Icon Color</Label>
              <input
                type="color"
                value={selectedElement.fill}
                onChange={(e) => handleChange({ fill: e.target.value })}
                className="w-10 h-6 rounded cursor-pointer p-0 border border-muted-foreground/20"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { setSelectedIds, toggleVisibility, selectOrderedElements, reorderElements } from '@/redux/features/editorSlice';
import { cn } from '@/lib/utils';
import {
  Type,
  Square,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Group as GroupIcon,
} from 'lucide-react';

export const LayerPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const elements = useAppSelector(selectOrderedElements);
  const selectedIds = useAppSelector((state) => state.editor.selectedIds);
  const [draggedId, setDraggedId] = React.useState<string | null>(null);

  const reverseElements = [...elements].reverse();

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    setDraggedId(null);
    if (sourceId === targetId) return;

    if (sourceId === targetId) return;

    const sourceIndex = elements.findIndex(el => el.id === sourceId);
    const targetIndex = elements.findIndex(el => el.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newOrder = [...elements];
    const [movedElement] = newOrder.splice(sourceIndex, 1);
    if (!movedElement) return;
    newOrder.splice(targetIndex, 0, movedElement);

    const newOrderIds = newOrder.map(el => el.id);
    dispatch(reorderElements(newOrderIds));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="h-4 w-4" />;
      case 'shape': return <Square className="h-4 w-4" />;
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'group': return <GroupIcon className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  const getName = (el: any) => {
    if (el.type === 'text') return el.text.substring(0, 20) || 'Text';
    if (el.type === 'shape') return el.shapeType.charAt(0).toUpperCase() + el.shapeType.slice(1);
    if (el.type === 'image') return 'Image';
    if (el.type === 'group') return 'Group';
    return 'Element';
  };

  return (
    <div className="flex flex-col gap-1 p-2">
      {reverseElements.length === 0 ? (
        <p className="text-sm text-muted-foreground italic text-center py-8">
          No layers yet.
        </p>
      ) : (
        reverseElements.map((el) => {
          const isSelected = selectedIds.includes(el.id);
          const isVisible = el.visible !== false;
          const isChild = !!el.parentId;
          const isDragging = draggedId === el.id;

          return (
            <div
              key={el.id}
              draggable
              onDragStart={(e) => handleDragStart(e, el.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, el.id)}
              onClick={() => dispatch(setSelectedIds([el.id]))}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-foreground",
                !isVisible && "opacity-60",
                isChild && "ml-4 border-l-2 border-muted pl-2",
                isDragging && "opacity-50 ring-2 ring-primary border-dashed border-2 border-primary"
              )}
            >
              <div className={cn(
                "shrink-0 transition-colors",
                isSelected
                  ? "text-primary-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              )}>
                {getIcon(el.type)}
              </div>
              <span className={cn(
                "flex-1 text-xs truncate font-medium",
                isSelected ? "text-primary-foreground" : "text-foreground"
              )}>
                {getName(el)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(toggleVisibility(el.id));
                }}
                className={cn(
                  "flex items-center justify-center h-6 w-6 rounded-sm transition-all",
                  (!isVisible || isSelected) ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  isSelected ? "hover:bg-white/20" : "hover:bg-muted-foreground/20"
                )}
              >
                {isVisible ? (
                  <Eye className={cn(
                    "h-3.5 w-3.5",
                    isSelected ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                ) : (
                  <EyeOff className={cn(
                    "h-3.5 w-3.5",
                    isSelected ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                )}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

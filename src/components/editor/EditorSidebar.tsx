'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayerPanel } from './LayerPanel';
import { PropertiesPanel } from './PropertiesPanel';

interface EditorSidebarProps {
  side: 'left' | 'right';
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ side }) => {
  return (
    <aside className={cn(
      "w-72 border-muted bg-card flex flex-col",
      side === 'left' ? "border-r" : "border-l"
    )}>
      <div className="p-4 border-b border-muted">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {side === 'left' ? 'Layers' : 'Properties'}
        </h2>
      </div>
      <ScrollArea className="flex-1">
        {side === 'left' ? <LayerPanel /> : <PropertiesPanel />}
      </ScrollArea>
      {side === 'left' && (
        <div className="p-4 border-t border-muted bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            Elements are stacked from top to bottom
          </p>
        </div>
      )}
    </aside>
  );
};

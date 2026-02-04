'use client';

import React from 'react';
import { Stage } from './Stage';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { useAppSelector } from '@/redux/store/hooks';

export const EditorMain: React.FC = () => {
  const showLayers = useAppSelector((state) => state.editor.showLayers);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <EditorToolbar />
      <div className="flex flex-1 overflow-hidden">
        {showLayers && <EditorSidebar side="left" />}
        <Stage />
        <EditorSidebar side="right" />
      </div>
    </div>
  );
};

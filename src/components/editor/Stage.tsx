'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage as KonvaStage, Layer, Transformer, Line, Group } from 'react-konva';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { setSelectedIds, updateElement, removeElement, setEditingId, selectRootElements, toggleSelection, undo, redo } from '@/redux/features/editorSlice';
import type { EditorElement, TextElement, GroupElement } from '@/types/editor';
import { CanvasElement } from '@/components/editor/CanvasElement';

interface Guideline {
  type: 'v' | 'h';
  pos: number;
}

export const Stage: React.FC = () => {
  const dispatch = useAppDispatch();
  const rootElements = useAppSelector(selectRootElements);
  const elementMap = useAppSelector((state) => state.editor.elements);
  const selectedIds = useAppSelector((state) => state.editor.selectedIds);
  const isEditing = useAppSelector((state) => state.editor.isEditing);
  const editingId = useAppSelector((state) => state.editor.editingId);

  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [tempText, setTempText] = useState('');

  const editingElement = editingId ? (elementMap[editingId] as TextElement | undefined) : undefined;

  useEffect(() => {
    if (stageRef.current) {
      (window as any).konvaStage = stageRef.current;
    }
  }, []);

  useEffect(() => {
    if (editingElement) {
      setTempText(editingElement.text);
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      }, 0);
    }
  }, [editingId, editingElement]);

  const handleSelect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      dispatch(setSelectedIds([]));
      dispatch(setEditingId(null));
    }
  };

  const handleElementSelect = useCallback((id: string, e: any) => {
    e.cancelBubble = true;
    const isMulti = e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
    if (isMulti) {
      dispatch(toggleSelection(id));
    } else {
      dispatch(setSelectedIds([id]));
    }
  }, [dispatch]);

  const handleEditDone = () => {
    if (editingId && editingElement) {
      dispatch(updateElement({ id: editingId, text: tempText }));
    }
    dispatch(setEditingId(null));
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditDone();
    }
    if (e.key === 'Escape') {
      dispatch(setEditingId(null));
    }
    e.stopPropagation();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName);
      if (isEditing || isInput) return;

      if (e.key === 'Backspace' || e.key === 'Delete') {
        selectedIds.forEach((id) => dispatch(removeElement(id)));
        return;
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          dispatch(redo());
        } else {
          dispatch(undo());
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        dispatch(redo());
        return;
      }

      const MOVE_STEP = e.shiftKey ? 10 : 1;
      const selectedElements = selectedIds.map(id => elementMap[id]).filter((el): el is EditorElement => !!el);

      if (selectedElements.length > 0 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        switch (e.key) {
          case 'ArrowUp':
            selectedElements.forEach(el => dispatch(updateElement({ id: el.id, y: el.y - MOVE_STEP })));
            break;
          case 'ArrowDown':
            selectedElements.forEach(el => dispatch(updateElement({ id: el.id, y: el.y + MOVE_STEP })));
            break;
          case 'ArrowLeft':
            selectedElements.forEach(el => dispatch(updateElement({ id: el.id, x: el.x - MOVE_STEP })));
            break;
          case 'ArrowRight':
            selectedElements.forEach(el => dispatch(updateElement({ id: el.id, x: el.x + MOVE_STEP })));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, elementMap, dispatch, isEditing]);

  useEffect(() => {
    if (transformerRef.current) {
      const stage = transformerRef.current.getStage();
      const selectedNodes = selectedIds
        .map((id) => stage.findOne(`#${id}`))
        .filter(Boolean);

      transformerRef.current.nodes(selectedNodes);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedIds, rootElements]);

  const handleDragMove = (e: any) => {
    const draggedNode = e.target;
    const SNAP_THRESHOLD = 5;

    const newGuidelines: Guideline[] = [];
    if (Math.abs(draggedNode.x()) < SNAP_THRESHOLD) { draggedNode.x(0); newGuidelines.push({ type: 'v', pos: 0 }); }
    setGuidelines(newGuidelines);
  };

  const handleDragEnd = (e: any) => {
    setGuidelines([]);
    dispatch(updateElement({
      id: e.target.id(),
      x: e.target.x(),
      y: e.target.y()
    }));
  };

  const handleGroupDragEnd = (e: any, group: GroupElement) => {
    setGuidelines([]);
    dispatch(updateElement({
      id: group.id,
      x: e.target.x(),
      y: e.target.y(),
    }));
  };

  const handleGroupTransformEnd = (e: any, group: GroupElement) => {
    const node = e.target;
    dispatch(updateElement({
      id: group.id,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    }));
  };

  const renderElement = (el: EditorElement) => {
    if (el.type === 'group') {
      const children = Object.values(elementMap)
        .filter(child => child.parentId === el.id)
        .sort((a, b) => a.index - b.index);

      return (
        <Group
          key={el.id}
          id={el.id}
          x={el.x}
          y={el.y}
          scaleX={el.scaleX || 1}
          scaleY={el.scaleY || 1}
          rotation={el.rotation}
          opacity={el.opacity}
          draggable={!isEditing}
          onClick={(e) => handleElementSelect(el.id, e)}
          onTap={(e) => handleElementSelect(el.id, e)}
          onDragMove={handleDragMove}
          onDragEnd={(e) => handleGroupDragEnd(e, el as GroupElement)}
          onTransformEnd={(e) => handleGroupTransformEnd(e, el as GroupElement)}
        >
          {children.map(renderElement)}
        </Group>
      );
    }

    return (
      <CanvasElement
        key={el.id}
        element={el}
        isSelected={selectedIds.includes(el.id)}
        onSelect={(e: any) => handleElementSelect(el.id, e || { evt: {} })}
        onChange={(newProps: Partial<EditorElement>) => dispatch(updateElement({ ...newProps, id: el.id }))}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      />
    );
  };

  return (
    <div className="flex-1 bg-muted/30 flex items-center justify-center overflow-hidden p-8">
      <div id="stage-parent" className="relative bg-white shadow-2xl" style={{ width: 600, height: 350 }}>
        <KonvaStage
          width={600}
          height={350}
          ref={stageRef}
          onMouseDown={handleSelect}
          onTouchStart={handleSelect}
        >
          <Layer>
            {rootElements.map(renderElement)}

            {guidelines.map((g, i) => (
              <Line
                key={i}
                points={g.type === 'v' ? [g.pos, 0, g.pos, 350] : [0, g.pos, 600, g.pos]}
                stroke="#3b82f6"
                strokeWidth={1}
                dash={[4, 4]}
              />
            ))}

            <Transformer
              ref={transformerRef}
              visible={!isEditing && selectedIds.length > 0}
              boundBoxFunc={(oldBox, newBox) => {
                if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox;
                return newBox;
              }}
            />
          </Layer>
        </KonvaStage>

        {editingId && editingElement && (
          <textarea
            ref={textareaRef}
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            onBlur={handleEditDone}
            onKeyDown={handleTextareaKeyDown}
            style={{
              position: 'absolute',
              top: editingElement.y,
              left: editingElement.x,
              width: editingElement.width,
              height: editingElement.height,
              transform: `rotate(${editingElement.rotation}deg)`,
              transformOrigin: 'top left',
              background: 'white',
              border: '1px solid #3b82f6',
              padding: '0px',
              fontSize: `${editingElement.fontSize}px`,
              fontFamily: editingElement.fontFamily,
              fontWeight: editingElement.fontWeight,
              fontStyle: editingElement.fontStyle,
              textAlign: editingElement.align as any,
              color: editingElement.fill,
              outline: 'none',
              resize: 'none',
              overflow: 'hidden',
              lineHeight: 1.2,
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
};

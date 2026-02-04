'use client';

import React from 'react';
import { Rect, Circle, Text as KonvaText, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import type { EditorElement } from '@/types/editor';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { setEditingId } from '@/redux/features/editorSlice';

interface CanvasElementProps {
  element: EditorElement;
  isSelected: boolean;
  onSelect: (e?: any) => void;
  onChange: (newProps: Partial<EditorElement>) => void;
  onDragMove?: (e: any) => void;
  onDragEnd?: (e: any) => void;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected: _isSelected,
  onSelect,
  onChange,
  onDragMove,
  onDragEnd: onDragEndProp,
}) => {
  const dispatch = useAppDispatch();
  const editingId = useAppSelector((state) => state.editor.editingId);
  const isEditing = editingId === element.id;

  const [image] = useImage(element.type === 'image' ? element.src : '');

  const handleDblClick = () => {
    if (element.type === 'text') {
      dispatch(setEditingId(element.id));
    }
  };

  const commonProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    rotation: element.rotation,
    opacity: element.opacity,
    draggable: !isEditing,
    onClick: onSelect,
    onTap: onSelect,
    onDblClick: handleDblClick,
    onDragMove: onDragMove || (() => { }),
    onDragEnd: (e: any) => {
      if (onDragEndProp) {
        onDragEndProp(e);
      } else {
        onChange({
          x: e.target.x(),
          y: e.target.y(),
        });
      }
    },
    onTransformEnd: (e: any) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      node.scaleX(1);
      node.scaleY(1);

      onChange({
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
      });
    },
  };

  switch (element.type) {
    case 'text':
      return (
        <KonvaText
          {...commonProps}
          text={isEditing ? '' : element.text}
          fontSize={element.fontSize}
          fontFamily={element.fontFamily}
          fontStyle={`${element.fontStyle} ${element.fontWeight}`}
          textDecoration={element.textDecoration}
          fill={element.fill}
          align={element.align}
          visible={!isEditing && element.visible !== false}
        />
      );
    case 'shape':
      if (element.shapeType === 'rectangle') {
        return (
          <Rect
            {...commonProps}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            visible={element.visible !== false}
          />
        );
      }
      if (element.shapeType === 'circle') {
        return (
          <Circle
            {...commonProps}
            radius={element.width / 2}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            visible={element.visible !== false}
          />
        );
      }
      return null;
    case 'image':
      return (
        <KonvaImage
          {...commonProps}
          image={image}
          visible={element.visible !== false}
        />
      );
    default:
      return null;
  }
};

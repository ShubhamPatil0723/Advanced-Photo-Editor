export type ElementType = 'text' | 'shape' | 'image' | 'icon' | 'group';
export type ShapeType = 'rectangle' | 'circle' | 'line';

export interface BaseElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    index: number;
    locked?: boolean;
    visible?: boolean;
    parentId?: string;
    scaleX?: number;
    scaleY?: number;
}

export interface GroupElement extends BaseElement {
    type: 'group';
}

export interface TextElement extends BaseElement {
    type: 'text';
    text: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
    fill: string;
    align: 'left' | 'center' | 'right';
}

export interface ShapeElement extends BaseElement {
    type: 'shape';
    shapeType: ShapeType;
    fill: string;
    stroke: string;
    strokeWidth: number;
}

export interface ImageElement extends BaseElement {
    type: 'image';
    src: string;
}

export interface IconElement extends BaseElement {
    type: 'icon';
    name: string;
    fill: string;
}

export type EditorElement = TextElement | ShapeElement | ImageElement | IconElement | GroupElement;

export interface EditorState {
    elements: Record<string, EditorElement>;
    maxZIndex: number;
    selectedIds: string[];
    isEditing: boolean;
    editingId: string | null;
    showLayers: boolean;
    history: {
        past: { elements: Record<string, EditorElement>; maxZIndex: number }[];
        present: { elements: Record<string, EditorElement>; maxZIndex: number };
        future: { elements: Record<string, EditorElement>; maxZIndex: number }[];
    };
}

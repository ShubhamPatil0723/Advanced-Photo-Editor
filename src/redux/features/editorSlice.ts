import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { EditorElement, EditorState, GroupElement } from '@/types/editor';
import type { RootState } from '../store';

const initialState: EditorState = {
    elements: {},
    maxZIndex: 0,
    selectedIds: [],
    isEditing: false,
    editingId: null,
    showLayers: true,
    history: {
        past: [],
        present: { elements: {}, maxZIndex: 0 },
        future: [],
    },
};

const saveToHistory = (state: EditorState) => {
    state.history.past.push({ ...state.history.present });
    if (state.history.past.length > 20) state.history.past.shift();
    state.history.present = { elements: state.elements, maxZIndex: state.maxZIndex };
    state.history.future = [];
};

const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        addElement: (state, action: PayloadAction<Omit<EditorElement, 'index'> & { index?: number }>) => {
            saveToHistory(state);
            state.maxZIndex += 1;
            const newElement = {
                ...action.payload,
                index: action.payload.index ?? state.maxZIndex,
            } as EditorElement;
            state.elements[newElement.id] = newElement;
            state.selectedIds = [newElement.id];
            state.history.present = { elements: state.elements, maxZIndex: state.maxZIndex };
        },
        updateElement: (state, action: PayloadAction<Partial<EditorElement> & { id: string }>) => {
            const { id, ...changes } = action.payload;
            if (state.elements[id]) {
                state.elements[id] = { ...state.elements[id], ...changes } as EditorElement;
                state.history.present = { elements: state.elements, maxZIndex: state.maxZIndex };
            }
        },
        removeElement: (state, action: PayloadAction<string>) => {
            saveToHistory(state);
            const idToRemove = action.payload;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [idToRemove]: deleted, ...rest } = state.elements;
            state.elements = rest;
            state.selectedIds = state.selectedIds.filter((id) => id !== idToRemove);
            state.history.present = { elements: state.elements, maxZIndex: state.maxZIndex };
        },
        setSelectedIds: (state, action: PayloadAction<string[]>) => {
            state.selectedIds = action.payload;
        },
        toggleSelection: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            if (state.selectedIds.includes(id)) {
                state.selectedIds = state.selectedIds.filter((sid) => sid !== id);
            } else {
                state.selectedIds.push(id);
            }
        },
        setIsEditing: (state, action: PayloadAction<boolean>) => {
            state.isEditing = action.payload;
            if (!action.payload) state.editingId = null;
        },
        setEditingId: (state, action: PayloadAction<string | null>) => {
            state.editingId = action.payload;
            state.isEditing = !!action.payload;
        },
        reorderElements: (state, action: PayloadAction<string[]>) => {
            const newOrderIds = action.payload;
            newOrderIds.forEach((id, index) => {
                if (state.elements[id]) {
                    state.elements[id].index = index + 1;
                }
            });
            state.maxZIndex = Math.max(state.maxZIndex, newOrderIds.length);
            state.history.present = { elements: state.elements, maxZIndex: state.maxZIndex };
        },
        toggleLayers: (state) => {
            state.showLayers = !state.showLayers;
        },
        toggleVisibility: (state, action: PayloadAction<string>) => {
            const element = state.elements[action.payload];
            if (element) {
                saveToHistory(state);
                element.visible = !element.visible;
                state.history.present = { elements: state.elements, maxZIndex: state.maxZIndex };
            }
        },
        groupSelected: (state) => {
            const selectedIds = state.selectedIds;
            if (selectedIds.length < 2) return;

            saveToHistory(state);

            const selectedElements = selectedIds.map(id => state.elements[id]).filter((el): el is EditorElement => !!el);

            const minX = Math.min(...selectedElements.map(el => el.x));
            const minY = Math.min(...selectedElements.map(el => el.y));
            const maxX = Math.max(...selectedElements.map(el => el.x + el.width));
            const maxY = Math.max(...selectedElements.map(el => el.y + el.height));

            state.maxZIndex += 1;
            const groupId = `group-${Date.now()}`;

            const group: GroupElement = {
                id: groupId,
                type: 'group',
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY,
                rotation: 0,
                opacity: 1,
                index: state.maxZIndex,
            };

            state.elements[groupId] = group;

            selectedElements.forEach(el => {
                el.parentId = groupId;
                el.x = el.x - minX;
                el.y = el.y - minY;
            });

            state.selectedIds = [groupId];
            state.history.present = { elements: state.elements, maxZIndex: state.maxZIndex };
        },
        ungroupSelected: (state) => {
            const selectedIds = state.selectedIds;
            const groupId = selectedIds[0];
            if (selectedIds.length !== 1 || !groupId) return;

            const group = state.elements[groupId];
            if (!group || group.type !== 'group') return;

            saveToHistory(state);

            const children = Object.values(state.elements).filter(el => el.parentId === group.id);

            children.forEach(child => {
                delete child.parentId;
                child.x = group.x + child.x;
                child.y = group.y + child.y;
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [group.id]: deleted, ...rest } = state.elements;
            state.elements = rest;

            state.selectedIds = children.map(c => c.id);
            state.history.present = { elements: state.elements, maxZIndex: state.maxZIndex };
        },
        undo: (state) => {
            if (state.history.past.length > 0) {
                const previous = state.history.past.pop()!;
                state.history.future.push({ ...state.history.present });
                state.elements = previous.elements;
                state.maxZIndex = previous.maxZIndex;
                state.history.present = previous;
                state.selectedIds = [];
            }
        },
        redo: (state) => {
            if (state.history.future.length > 0) {
                const next = state.history.future.pop()!;
                state.history.past.push({ ...state.history.present });
                state.elements = next.elements;
                state.maxZIndex = next.maxZIndex;
                state.history.present = next;
                state.selectedIds = [];
            }
        },
    },
});

export const {
    addElement,
    updateElement,
    removeElement,
    setSelectedIds,
    toggleSelection,
    setIsEditing,
    setEditingId,
    toggleLayers,
    toggleVisibility,
    reorderElements,
    groupSelected,
    ungroupSelected,
    undo,
    redo,
} = editorSlice.actions;

const selectEditorDomain = (state: RootState) => state.editor;

export const selectOrderedElements = createSelector(
    [selectEditorDomain],
    (editor) => {
        return Object.values(editor.elements).sort((a, b) => a.index - b.index);
    }
);

export const selectRootElements = createSelector(
    [selectOrderedElements],
    (elements) => elements.filter(el => !el.parentId)
);

export default editorSlice.reducer;

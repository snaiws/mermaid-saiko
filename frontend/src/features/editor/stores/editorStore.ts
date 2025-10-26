import { create } from 'zustand';
import type { CursorPosition } from '../../../types/editor';

interface EditorStore {
  // State
  code: string;
  cursorPosition: CursorPosition;
  undoStack: string[];
  redoStack: string[];

  // Actions
  updateCode: (newCode: string, cursorPosition: CursorPosition) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  reset: () => void;

  // Computed
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const MAX_HISTORY = 50;

export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial State
  code: '```mermaid\ngraph LR\n    A[Start] --> B[Process]\n    B --> C[End]\n```',
  cursorPosition: { line: 1, column: 1 },
  undoStack: [],
  redoStack: [],

  // Actions
  updateCode: (newCode, cursorPosition) => {
    const { code: currentCode, undoStack } = get();

    // 코드가 동일하면 아무 작업도 하지 않음
    if (currentCode === newCode) return;

    // 현재 코드를 undo stack에 저장
    const newUndoStack = [...undoStack, currentCode].slice(-MAX_HISTORY);

    set({
      code: newCode,
      cursorPosition,
      undoStack: newUndoStack,
      redoStack: [], // redo stack 초기화
    });
  },

  undo: () => {
    const { code: currentCode, undoStack, redoStack } = get();

    if (undoStack.length === 0) return;

    const previousCode = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    const newRedoStack = [...redoStack, currentCode].slice(-MAX_HISTORY);

    set({
      code: previousCode,
      undoStack: newUndoStack,
      redoStack: newRedoStack,
    });
  },

  redo: () => {
    const { code: currentCode, undoStack, redoStack } = get();

    if (redoStack.length === 0) return;

    const nextCode = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    const newUndoStack = [...undoStack, currentCode].slice(-MAX_HISTORY);

    set({
      code: nextCode,
      undoStack: newUndoStack,
      redoStack: newRedoStack,
    });
  },

  clearHistory: () => {
    set({
      undoStack: [],
      redoStack: [],
    });
  },

  reset: () => {
    set({
      code: '```mermaid\ngraph LR\n    A[Start] --> B[Process]\n    B --> C[End]\n```',
      cursorPosition: { line: 1, column: 1 },
      undoStack: [],
      redoStack: [],
    });
  },

  // Computed
  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,
}));

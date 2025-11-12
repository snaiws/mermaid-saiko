/**
 * Editor 관련 타입 정의
 */

export interface CursorPosition {
  line: number;
  column: number;
}

export interface EditorState {
  code: string;
  cursorPosition: CursorPosition;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * 코드 히스토리 Value Object
 *
 * 책임:
 * - 코드 변경 이력 관리
 * - 스택 크기 제한
 */
export class CodeHistory {
  private readonly _undoStack: string[];
  private readonly _redoStack: string[];
  private static readonly MAX_HISTORY_SIZE = 50;

  private constructor(undoStack: string[], redoStack: string[]) {
    this._undoStack = undoStack;
    this._redoStack = redoStack;
  }

  /**
   * 빈 히스토리 생성
   */
  static create(): CodeHistory {
    return new CodeHistory([], []);
  }

  /**
   * 기존 스택으로 히스토리 재구성
   */
  static reconstitute(
    undoStack: string[],
    redoStack: string[],
  ): CodeHistory {
    return new CodeHistory([...undoStack], [...redoStack]);
  }

  /**
   * 새로운 코드 추가 (현재 코드를 undo 스택에 저장)
   */
  pushUndo(code: string): CodeHistory {
    const newUndoStack = [...this._undoStack, code];

    // 스택 크기 제한
    if (newUndoStack.length > CodeHistory.MAX_HISTORY_SIZE) {
      newUndoStack.shift(); // 가장 오래된 항목 제거
    }

    // redo 스택은 비움 (새로운 변경이 발생하면 redo 불가)
    return new CodeHistory(newUndoStack, []);
  }

  /**
   * Undo 실행
   */
  undo(currentCode: string): { code: string; history: CodeHistory } | null {
    if (this._undoStack.length === 0) {
      return null; // Undo 불가
    }

    const newUndoStack = [...this._undoStack];
    const previousCode = newUndoStack.pop()!;

    const newRedoStack = [...this._redoStack, currentCode];

    // Redo 스택 크기 제한
    if (newRedoStack.length > CodeHistory.MAX_HISTORY_SIZE) {
      newRedoStack.shift();
    }

    return {
      code: previousCode,
      history: new CodeHistory(newUndoStack, newRedoStack),
    };
  }

  /**
   * Redo 실행
   */
  redo(currentCode: string): { code: string; history: CodeHistory } | null {
    if (this._redoStack.length === 0) {
      return null; // Redo 불가
    }

    const newRedoStack = [...this._redoStack];
    const nextCode = newRedoStack.pop()!;

    const newUndoStack = [...this._undoStack, currentCode];

    // Undo 스택 크기 제한
    if (newUndoStack.length > CodeHistory.MAX_HISTORY_SIZE) {
      newUndoStack.shift();
    }

    return {
      code: nextCode,
      history: new CodeHistory(newUndoStack, newRedoStack),
    };
  }

  /**
   * 히스토리 전체 삭제
   */
  clear(): CodeHistory {
    return new CodeHistory([], []);
  }

  get undoStack(): string[] {
    return [...this._undoStack];
  }

  get redoStack(): string[] {
    return [...this._redoStack];
  }

  get canUndo(): boolean {
    return this._undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this._redoStack.length > 0;
  }
}

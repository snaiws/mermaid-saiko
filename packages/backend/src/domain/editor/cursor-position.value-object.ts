/**
 * 커서 위치 Value Object
 *
 * 책임:
 * - 커서 위치 추적
 * - 위치 유효성 검증
 */
export class CursorPosition {
  private readonly _line: number;
  private readonly _column: number;

  private constructor(line: number, column: number) {
    this._line = line;
    this._column = column;
  }

  /**
   * 커서 위치 생성
   */
  static create(line: number, column: number): CursorPosition {
    // 비즈니스 규칙: 커서 위치는 음수 불가
    if (line < 0) {
      throw new Error('Line number cannot be negative');
    }
    if (column < 0) {
      throw new Error('Column number cannot be negative');
    }

    return new CursorPosition(line, column);
  }

  /**
   * 초기 커서 위치 (0, 0)
   */
  static initial(): CursorPosition {
    return new CursorPosition(0, 0);
  }

  get line(): number {
    return this._line;
  }

  get column(): number {
    return this._column;
  }

  equals(other: CursorPosition): boolean {
    return this._line === other._line && this._column === other._column;
  }
}

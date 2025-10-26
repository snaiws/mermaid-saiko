/**
 * 렌더링 에러 Value Object
 *
 * 책임:
 * - 파싱/렌더링 에러 정보 캡슐화
 */
export class RenderingError {
  private readonly _message: string;
  private readonly _line: number | null;
  private readonly _column: number | null;

  private constructor(
    message: string,
    line: number | null = null,
    column: number | null = null,
  ) {
    this._message = message;
    this._line = line;
    this._column = column;
  }

  /**
   * 렌더링 에러 생성
   */
  static create(
    message: string,
    line?: number,
    column?: number,
  ): RenderingError {
    if (!message || message.trim().length === 0) {
      throw new Error('Error message cannot be empty');
    }

    return new RenderingError(message.trim(), line ?? null, column ?? null);
  }

  get message(): string {
    return this._message;
  }

  get line(): number | null {
    return this._line;
  }

  get column(): number | null {
    return this._column;
  }

  /**
   * 에러를 사람이 읽기 쉬운 형식으로 포맷
   */
  toString(): string {
    if (this._line !== null && this._column !== null) {
      return `${this._message} (Line ${this._line}, Column ${this._column})`;
    }
    if (this._line !== null) {
      return `${this._message} (Line ${this._line})`;
    }
    return this._message;
  }
}

/**
 * Export 에러 Value Object
 *
 * 책임:
 * - Export 실패 정보 캡슐화
 */
export class ExportError {
  private readonly _message: string;

  private constructor(message: string) {
    this._message = message;
  }

  /**
   * Export 에러 생성
   */
  static create(message: string): ExportError {
    if (!message || message.trim().length === 0) {
      throw new Error('Error message cannot be empty');
    }

    return new ExportError(message.trim());
  }

  get message(): string {
    return this._message;
  }

  toString(): string {
    return this._message;
  }
}

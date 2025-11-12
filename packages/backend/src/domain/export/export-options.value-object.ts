/**
 * Export 옵션 Value Object
 *
 * 책임:
 * - Export 옵션 유효성 검증
 * - 크기 값이 양수인지 확인
 * - 파일명에 특수문자 제한
 */
export class ExportOptions {
  private readonly _fileName: string | null;
  private readonly _width: number | null;
  private readonly _height: number | null;
  private readonly _scale: number;

  private constructor(
    fileName: string | null,
    width: number | null,
    height: number | null,
    scale: number,
  ) {
    this._fileName = fileName;
    this._width = width;
    this._height = height;
    this._scale = scale;
  }

  /**
   * Export 옵션 생성
   */
  static create(options?: {
    fileName?: string | null;
    width?: number | null;
    height?: number | null;
    scale?: number;
  }): ExportOptions {
    const fileName = options?.fileName ?? null;
    const width = options?.width ?? null;
    const height = options?.height ?? null;
    const scale = options?.scale ?? 1;

    // 파일명 유효성 검증
    if (fileName !== null) {
      ExportOptions.validateFileName(fileName);
    }

    // 크기 유효성 검증
    if (width !== null && width <= 0) {
      throw new Error('Width must be greater than 0');
    }
    if (height !== null && height <= 0) {
      throw new Error('Height must be greater than 0');
    }
    if (scale <= 0) {
      throw new Error('Scale must be greater than 0');
    }

    return new ExportOptions(fileName, width, height, scale);
  }

  /**
   * 파일명 유효성 검증
   */
  private static validateFileName(fileName: string): void {
    const invalidChars = /[\/\\:*?"<>|]/;
    if (invalidChars.test(fileName)) {
      throw new Error(
        'File name cannot contain special characters: / \\ : * ? " < > |',
      );
    }

    if (fileName.trim().length === 0) {
      throw new Error('File name cannot be empty');
    }
  }

  get fileName(): string | null {
    return this._fileName;
  }

  get width(): number | null {
    return this._width;
  }

  get height(): number | null {
    return this._height;
  }

  get scale(): number {
    return this._scale;
  }
}

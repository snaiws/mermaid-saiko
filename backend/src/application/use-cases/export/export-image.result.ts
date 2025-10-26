import { ImageFormat } from '../../../domain/export/image-format.enum';

/**
 * Export Image Result
 *
 * Export 결과 DTO
 */
export class ExportImageResult {
  constructor(
    public readonly imageId: string,
    public readonly imageData: Buffer | string,
    public readonly format: ImageFormat,
    public readonly fileName: string,
    public readonly fileSize: number,
  ) {}
}

import { ExportPngUseCase } from '../../application/use-cases/export/export-png.use-case';
import { ExportPngCommand } from '../../application/use-cases/export/export-png.command';
import { S3Service } from '../../infrastructure/storage/s3.service';

export interface RenderDiagramInput {
  mermaidCode: string;
}

export interface RenderDiagramOutput {
  success: boolean;
  imageUrl?: string;
  diagramType?: string;
  error?: string;
}

export class RenderDiagramTool {
  constructor(
    private readonly exportPngUseCase: ExportPngUseCase,
    private readonly s3Service: S3Service,
  ) {}

  async execute(input: RenderDiagramInput): Promise<RenderDiagramOutput> {
    try {
      // 1. PNG 생성 (Export Use Case 사용)
      const exportCommand = new ExportPngCommand(
        input.mermaidCode,
        800, // width
        600, // height
      );
      const exportResult = await this.exportPngUseCase.execute(exportCommand);

      // 2. S3에 업로드
      const imageBuffer = Buffer.isBuffer(exportResult.imageData)
        ? exportResult.imageData
        : Buffer.from(exportResult.imageData);

      const imageUrl = await this.s3Service.uploadFile(
        imageBuffer,
        exportResult.fileName,
        'image/png',
      );

      return {
        success: true,
        imageUrl,
        diagramType: exportResult.format,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

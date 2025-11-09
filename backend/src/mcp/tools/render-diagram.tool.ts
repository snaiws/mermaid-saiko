import { ExportPngUseCase } from '../../application/use-cases/export/export-png.use-case';
import { ExportPngCommand } from '../../application/use-cases/export/export-png.command';
import { S3Service } from '../../infrastructure/storage/s3.service';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface RenderDiagramInput {
  mermaidCode: string;
  useLocalStorage?: boolean; // stdio 모드에서는 true
}

export interface RenderDiagramOutput {
  success: boolean;
  imageUrl?: string;
  diagramType?: string;
  error?: string;
}

export class RenderDiagramTool {
  private readonly localStorageDir = path.join(
    process.cwd(),
    'storage',
    'diagrams',
  );

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

      const imageBuffer = Buffer.isBuffer(exportResult.imageData)
        ? exportResult.imageData
        : Buffer.from(exportResult.imageData);

      let imageUrl: string;

      if (input.useLocalStorage) {
        // stdio 모드: 로컬 파일 시스템에 저장
        await fs.mkdir(this.localStorageDir, { recursive: true });

        const fileName = `${Date.now()}-${exportResult.fileName}`;
        const relativePath = path.join('storage', 'diagrams', fileName);
        const absolutePath = path.join(process.cwd(), relativePath);

        await fs.writeFile(absolutePath, imageBuffer);

        // 절대 경로 반환
        imageUrl = absolutePath;
      } else {
        // HTTP 모드: S3에 업로드
        imageUrl = await this.s3Service.uploadFile(
          imageBuffer,
          exportResult.fileName,
          'image/png',
        );
      }

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

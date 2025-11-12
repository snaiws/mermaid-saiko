import { ExportPngUseCase } from '../../application/use-cases/export/export-png.use-case';
import { ExportPngCommand } from '../../application/use-cases/export/export-png.command';
import { S3Service } from '../../infrastructure/storage/s3.service';
import * as fs from 'fs/promises';
import * as path from 'path';

export type OutputType = 'file' | 'base64';

export interface RenderDiagramInput {
  mermaidCode: string;
  outputType?: OutputType; // 'file' (default) or 'base64'
  basePath?: string; // 저장 경로 (optional)
  useLocalStorage?: boolean; // stdio 모드에서는 true
}

export interface RenderDiagramOutput {
  success: boolean;
  imageUrl?: string; // outputType='file'일 때
  imageBase64?: string; // outputType='base64'일 때
  diagramType?: string;
  error?: string;
}

export class RenderDiagramTool {
  private readonly localStorageDir: string;

  constructor(
    private readonly exportPngUseCase: ExportPngUseCase,
    private readonly s3Service: S3Service,
    basePath?: string,
  ) {
    // basePath가 주어지면 사용, 아니면 process.cwd() 사용
    const baseDir = basePath || process.cwd();
    this.localStorageDir = path.join(baseDir, 'storage', 'diagrams');
  }

  async execute(input: RenderDiagramInput): Promise<RenderDiagramOutput> {
    try {
      // 1. PNG 생성 (Export Use Case 사용)
      // 더 높은 해상도 사용: 1920x1440 (Full HD 기준)
      // ImagePuppeteerConverterService에서 scale=2 (deviceScaleFactor)를 사용하므로
      // 최종 출력은 3840x2880 픽셀이 됨 (4K 수준)
      const exportCommand = new ExportPngCommand(
        input.mermaidCode,
        1920, // width (2.4x 증가)
        1440, // height (2.4x 증가)
      );
      const exportResult = await this.exportPngUseCase.execute(exportCommand);

      const imageBuffer = Buffer.isBuffer(exportResult.imageData)
        ? exportResult.imageData
        : Buffer.from(exportResult.imageData);

      const outputType = input.outputType || 'file';

      // base64 모드
      if (outputType === 'base64') {
        return {
          success: true,
          imageBase64: imageBuffer.toString('base64'),
          diagramType: exportResult.format,
        };
      }

      // file 모드
      let imageUrl: string;

      if (input.useLocalStorage) {
        // stdio 모드: 로컬 파일 시스템에 저장
        // input.basePath가 주어지면 우선 사용, 아니면 생성자에서 설정한 경로 사용
        const storageDir = input.basePath
          ? path.join(input.basePath, 'storage', 'diagrams')
          : this.localStorageDir;

        await fs.mkdir(storageDir, { recursive: true });

        const fileName = `${Date.now()}-${exportResult.fileName}`;
        const absolutePath = path.join(storageDir, fileName);

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

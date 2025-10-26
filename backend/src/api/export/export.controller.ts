import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  StreamableFile,
  Header,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExportPngUseCase } from '../../application/use-cases/export/export-png.use-case';
import { ExportSvgUseCase } from '../../application/use-cases/export/export-svg.use-case';
import { ExportPngCommand } from '../../application/use-cases/export/export-png.command';
import { ExportSvgCommand } from '../../application/use-cases/export/export-svg.command';
import { ExportPngRequestDto, ExportSvgRequestDto } from './dto';

@Controller('api/v1/export')
export class ExportController {
  constructor(
    private readonly exportPngUseCase: ExportPngUseCase,
    private readonly exportSvgUseCase: ExportSvgUseCase,
  ) {}

  /**
   * POST /api/v1/export/png
   * Mermaid 코드를 PNG 이미지로 변환
   */
  @Post('png')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'image/png')
  async exportPng(
    @Body() request: ExportPngRequestDto,
  ): Promise<StreamableFile> {
    try {
      const command = new ExportPngCommand(
        request.mermaidCode,
        request.options?.width ?? null,
        request.options?.height ?? null,
        request.options?.backgroundColor ?? 'white',
      );

      const result = await this.exportPngUseCase.execute(command);

      // Content-Disposition 헤더는 동적으로 설정할 수 없으므로 StreamableFile options에서 설정
      const imageBuffer = Buffer.isBuffer(result.imageData)
        ? result.imageData
        : Buffer.from(result.imageData as string);

      return new StreamableFile(imageBuffer, {
        type: 'image/png',
        disposition: `attachment; filename="${result.fileName}"`,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('render')) {
        throw new UnprocessableEntityException({
          code: 'RENDER_FAILED',
          message: error.message,
        });
      }

      throw new InternalServerErrorException({
        code: 'EXPORT_FAILED',
        message: 'PNG export failed',
      });
    }
  }

  /**
   * POST /api/v1/export/svg
   * Mermaid 코드를 SVG 이미지로 변환
   */
  @Post('svg')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'image/svg+xml')
  async exportSvg(
    @Body() request: ExportSvgRequestDto,
  ): Promise<StreamableFile> {
    try {
      const command = new ExportSvgCommand(request.mermaidCode);
      const result = await this.exportSvgUseCase.execute(command);

      const svgBuffer = Buffer.isBuffer(result.imageData)
        ? result.imageData
        : Buffer.from(result.imageData as string);

      return new StreamableFile(svgBuffer, {
        type: 'image/svg+xml',
        disposition: `attachment; filename="${result.fileName}"`,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('render')) {
        throw new UnprocessableEntityException({
          code: 'RENDER_FAILED',
          message: error.message,
        });
      }

      throw new InternalServerErrorException({
        code: 'EXPORT_FAILED',
        message: 'SVG export failed',
      });
    }
  }
}

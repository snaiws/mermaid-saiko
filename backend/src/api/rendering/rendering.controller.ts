import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RenderDiagramUseCase } from '../../application/use-cases/rendering/render-diagram.use-case';
import { RenderDiagramCommand } from '../../application/use-cases/rendering/render-diagram.command';
import { IDiagramRepository } from '../../domain/rendering/diagram.repository.interface';
import { ApiSuccessResponse } from '../common/api-response.dto';
import {
  RenderDiagramRequestDto,
  RenderDiagramResponseDto,
  GetDiagramResponseDto,
} from './dto';

@Controller('api/v1/rendering')
export class RenderingController {
  constructor(
    private readonly renderDiagramUseCase: RenderDiagramUseCase,
    private readonly diagramRepository: IDiagramRepository,
  ) {}

  /**
   * POST /api/v1/rendering/render
   * Mermaid 코드를 다이어그램으로 렌더링
   */
  @Post('render')
  @HttpCode(HttpStatus.OK)
  async renderDiagram(
    @Body() request: RenderDiagramRequestDto,
  ): Promise<ApiSuccessResponse<RenderDiagramResponseDto>> {
    try {
      const command = new RenderDiagramCommand(request.mermaidCode);
      const result = await this.renderDiagramUseCase.execute(command);

      const response = new RenderDiagramResponseDto(
        result.diagramId,
        result.renderedSvg,
        result.diagramType,
        new Date(),
      );

      return new ApiSuccessResponse(response);
    } catch (error) {
      // 렌더링 실패는 422 Unprocessable Entity
      throw new UnprocessableEntityException({
        code: 'RENDER_FAILED',
        message: error instanceof Error ? error.message : 'Rendering failed',
      });
    }
  }

  /**
   * GET /api/v1/rendering/diagram/:id
   * 이전에 렌더링된 다이어그램 조회
   */
  @Get('diagram/:id')
  async getDiagram(
    @Param('id') id: string,
  ): Promise<ApiSuccessResponse<GetDiagramResponseDto>> {
    const diagram = await this.diagramRepository.findById(id);

    if (!diagram) {
      throw new NotFoundException({
        code: 'DIAGRAM_NOT_FOUND',
        message: `Diagram with id ${id} not found`,
      });
    }

    const response = new GetDiagramResponseDto(
      diagram.id,
      diagram.renderedSvg,
      diagram.mermaidCode.diagramType,
      diagram.mermaidCode.rawCode,
      diagram.renderStatus,
      diagram.createdAt,
      diagram.error
        ? {
            message: diagram.error.message,
            code: diagram.error.code,
          }
        : undefined,
    );

    return new ApiSuccessResponse(response);
  }
}

import { DiagramType } from '../../../domain/rendering/diagram-type.enum';
import { RenderStatus } from '../../../domain/rendering/render-status.enum';

export class GetDiagramResponseDto {
  diagramId: string;
  renderedSvg: string | null;
  diagramType: DiagramType;
  mermaidCode: string;
  status: RenderStatus;
  createdAt: Date;
  error?: {
    message: string;
    code?: string;
  };

  constructor(
    diagramId: string,
    renderedSvg: string | null,
    diagramType: DiagramType,
    mermaidCode: string,
    status: RenderStatus,
    createdAt: Date,
    error?: { message: string; code?: string },
  ) {
    this.diagramId = diagramId;
    this.renderedSvg = renderedSvg;
    this.diagramType = diagramType;
    this.mermaidCode = mermaidCode;
    this.status = status;
    this.createdAt = createdAt;
    this.error = error;
  }
}

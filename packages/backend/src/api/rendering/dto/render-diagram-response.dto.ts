import { DiagramType } from '../../../domain/rendering/diagram-type.enum';

export class RenderDiagramResponseDto {
  diagramId: string;
  renderedSvg: string;
  diagramType: DiagramType;
  createdAt: Date;

  constructor(diagramId: string, renderedSvg: string, diagramType: DiagramType, createdAt: Date) {
    this.diagramId = diagramId;
    this.renderedSvg = renderedSvg;
    this.diagramType = diagramType;
    this.createdAt = createdAt;
  }
}

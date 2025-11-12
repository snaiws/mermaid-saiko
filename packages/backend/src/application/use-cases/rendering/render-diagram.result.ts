import { DiagramType } from '../../../domain/rendering/diagram-type.enum';

/**
 * Render Diagram Result
 *
 * 렌더링 결과 DTO
 */
export class RenderDiagramResult {
  constructor(
    public readonly diagramId: string,
    public readonly renderedSvg: string,
    public readonly diagramType: DiagramType,
  ) {}
}

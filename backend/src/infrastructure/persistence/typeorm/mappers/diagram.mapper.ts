import { Diagram } from '../../../../domain/rendering/diagram.aggregate';
import { RenderingError } from '../../../../domain/rendering/rendering-error.value-object';
import { DiagramEntity } from '../entities/diagram.entity';

export class DiagramMapper {
  /**
   * Aggregate → Entity
   */
  static toEntity(diagram: Diagram): DiagramEntity {
    const entity = new DiagramEntity();

    entity.id = diagram.id;
    entity.mermaidCode = diagram.mermaidCode.rawCode;
    entity.diagramType = diagram.mermaidCode.diagramType;
    entity.renderedSvg = diagram.renderedSvg;
    entity.renderStatus = diagram.renderStatus;
    entity.errorMessage = diagram.error?.message ?? null;
    entity.errorCode = diagram.error?.code ?? null;
    entity.createdAt = diagram.createdAt;

    return entity;
  }

  /**
   * Entity → Aggregate
   */
  static toDomain(entity: DiagramEntity): Diagram {
    let error: RenderingError | null = null;

    if (entity.errorMessage) {
      error = RenderingError.create(entity.errorMessage, null, null);
    }

    return Diagram.reconstitute(
      entity.id,
      entity.mermaidCode,
      entity.renderedSvg,
      entity.renderStatus,
      error,
      entity.createdAt,
    );
  }
}

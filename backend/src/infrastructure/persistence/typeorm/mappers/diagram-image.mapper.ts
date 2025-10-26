import { DiagramImage } from '../../../../domain/export/diagram-image.aggregate';
import { ExportOptions } from '../../../../domain/export/export-options.value-object';
import { ExportError } from '../../../../domain/export/export-error.value-object';
import { DiagramImageEntity } from '../entities/diagram-image.entity';

export class DiagramImageMapper {
  /**
   * Aggregate → Entity
   */
  static toEntity(diagramImage: DiagramImage): DiagramImageEntity {
    const entity = new DiagramImageEntity();

    entity.id = diagramImage.id;
    entity.sourceSvg = diagramImage.sourceSvg;
    entity.format = diagramImage.format;
    entity.imageData =
      diagramImage.imageData instanceof Buffer
        ? diagramImage.imageData
        : diagramImage.imageData
          ? Buffer.from(diagramImage.imageData)
          : null;
    entity.exportStatus = diagramImage.exportStatus;
    entity.fileName = diagramImage.options.fileName ?? '';
    entity.width = diagramImage.options.width;
    entity.height = diagramImage.options.height;
    entity.scale = diagramImage.options.scale;
    entity.backgroundColor = diagramImage.options.backgroundColor;
    entity.errorMessage = diagramImage.error?.message ?? null;
    entity.errorCode = diagramImage.error?.code ?? null;
    entity.createdAt = diagramImage.createdAt;

    return entity;
  }

  /**
   * Entity → Aggregate
   */
  static toDomain(entity: DiagramImageEntity): DiagramImage {
    const options = ExportOptions.create({
      fileName: entity.fileName || null,
      width: entity.width,
      height: entity.height,
      scale: entity.scale ?? 1,
    });

    let error: ExportError | null = null;
    if (entity.errorMessage) {
      error = ExportError.create(entity.errorMessage);
    }

    const fileSize = entity.imageData ? entity.imageData.length : 0;

    return DiagramImage.reconstitute(
      entity.id,
      entity.sourceSvg,
      entity.format,
      entity.imageData,
      options,
      entity.exportStatus,
      error,
      entity.createdAt,
      fileSize,
    );
  }
}

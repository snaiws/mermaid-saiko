import { Injectable } from '@nestjs/common';
import { DiagramImage } from '../../../domain/export/diagram-image.aggregate';
import { IDiagramImageRepository } from '../../../domain/export/diagram-image.repository.interface';
import { IImageConverter } from '../../../domain/export/image-converter.interface';
import { ImageFormat } from '../../../domain/export/image-format.enum';
import { ExportError } from '../../../domain/export/export-error.value-object';
import { IMermaidRenderer } from '../../../domain/rendering/mermaid-renderer.interface';
import { DomainEventPublisherService } from '../../../infrastructure/events/domain-event-publisher.service';
import { ExportPngCommand } from './export-png.command';
import { ExportImageResult } from './export-image.result';

/**
 * Export PNG Use Case
 *
 * 책임:
 * 1. Mermaid 코드를 SVG로 렌더링
 * 2. DiagramImage Aggregate 생성
 * 3. Image Converter로 PNG 변환
 * 4. 변환 결과를 Aggregate에 반영
 * 5. Repository에 저장
 */
@Injectable()
export class ExportPngUseCase {
  constructor(
    private readonly diagramImageRepository: IDiagramImageRepository,
    private readonly mermaidRenderer: IMermaidRenderer,
    private readonly imageConverter: IImageConverter,
    private readonly eventPublisher: DomainEventPublisherService,
  ) {}

  async execute(command: ExportPngCommand): Promise<ExportImageResult> {
    try {
      // 1. Mermaid 코드를 SVG로 렌더링
      const svg = await this.mermaidRenderer.render(command.mermaidCode);

      // 2. DiagramImage Aggregate 생성
      const diagramImage = DiagramImage.create(svg, ImageFormat.PNG, {
        width: command.width,
        height: command.height,
      });

      // 3. PNG로 변환
      const pngBuffer = await this.imageConverter.convertToPng(svg, {
        width: command.width,
        height: command.height,
        backgroundColor: command.backgroundColor,
      });

      // 4. Export 성공 처리
      diagramImage.markAsExported(pngBuffer);

      // 5. Repository에 저장
      await this.diagramImageRepository.save(diagramImage);

      // 6. Domain Events 발행
      const events = diagramImage.pullDomainEvents();
      this.eventPublisher.publishAll(events);

      // 7. Result DTO 반환
      return new ExportImageResult(
        diagramImage.id,
        diagramImage.getImageData(),
        diagramImage.format,
        diagramImage.getFileName(),
        diagramImage.fileSize,
      );
    } catch (error) {
      // Export 실패 시 에러 로깅 및 발생
      console.error('PNG Export Error:', error);
      throw error;
    }
  }
}

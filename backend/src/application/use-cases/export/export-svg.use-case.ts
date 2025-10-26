import { Injectable } from '@nestjs/common';
import { DiagramImage } from '../../../domain/export/diagram-image.aggregate';
import { IDiagramImageRepository } from '../../../domain/export/diagram-image.repository.interface';
import { IImageConverter } from '../../../domain/export/image-converter.interface';
import { ImageFormat } from '../../../domain/export/image-format.enum';
import { IMermaidRenderer } from '../../../domain/rendering/mermaid-renderer.interface';
import { DomainEventPublisherService } from '../../../infrastructure/events/domain-event-publisher.service';
import { ExportSvgCommand } from './export-svg.command';
import { ExportImageResult } from './export-image.result';

/**
 * Export SVG Use Case
 *
 * 책임:
 * 1. Mermaid 코드를 SVG로 렌더링
 * 2. DiagramImage Aggregate 생성
 * 3. SVG 정리 (원본 유지)
 * 4. Repository에 저장
 */
@Injectable()
export class ExportSvgUseCase {
  constructor(
    private readonly diagramImageRepository: IDiagramImageRepository,
    private readonly mermaidRenderer: IMermaidRenderer,
    private readonly imageConverter: IImageConverter,
    private readonly eventPublisher: DomainEventPublisherService,
  ) {}

  async execute(command: ExportSvgCommand): Promise<ExportImageResult> {
    try {
      // 1. Mermaid 코드를 SVG로 렌더링
      const svg = await this.mermaidRenderer.render(command.mermaidCode);

      // 2. DiagramImage Aggregate 생성
      const diagramImage = DiagramImage.create(svg, ImageFormat.SVG);

      // 3. SVG는 변환 없이 원본 사용
      const svgBuffer = await this.imageConverter.convert(
        svg,
        ImageFormat.SVG,
      );

      // 4. Export 성공 처리
      diagramImage.markAsExported(svgBuffer);

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
      // Export 실패 시 에러 발생
      throw error;
    }
  }
}

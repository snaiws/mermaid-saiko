import { Injectable } from '@nestjs/common';
import { Diagram } from '../../../domain/rendering/diagram.aggregate';
import { IDiagramRepository } from '../../../domain/rendering/diagram.repository.interface';
import { IMermaidRenderer } from '../../../domain/rendering/mermaid-renderer.interface';
import { RenderingError } from '../../../domain/rendering/rendering-error.value-object';
import { DomainEventPublisherService } from '../../../infrastructure/events/domain-event-publisher.service';
import { RenderDiagramCommand } from './render-diagram.command';
import { RenderDiagramResult } from './render-diagram.result';

/**
 * Render Diagram Use Case
 *
 * 책임:
 * 1. Diagram Aggregate 생성
 * 2. Mermaid Renderer 호출하여 SVG 생성
 * 3. 렌더링 결과를 Aggregate에 반영
 * 4. Repository에 저장
 * 5. Domain Events 처리 (Event Bus로 발행)
 */
@Injectable()
export class RenderDiagramUseCase {
  constructor(
    private readonly diagramRepository: IDiagramRepository,
    private readonly mermaidRenderer: IMermaidRenderer,
    private readonly eventPublisher: DomainEventPublisherService,
  ) {}

  async execute(command: RenderDiagramCommand): Promise<RenderDiagramResult> {
    // 1. Diagram Aggregate 생성
    const diagram = Diagram.create(command.mermaidCode);

    try {
      // 2. Mermaid Renderer로 SVG 생성
      const svg = await this.mermaidRenderer.render(command.mermaidCode);

      // 3. 렌더링 성공 처리
      diagram.markAsRendered(svg);

      // 4. Repository에 저장
      await this.diagramRepository.save(diagram);

      // 5. Domain Events 발행
      const events = diagram.pullDomainEvents();
      this.eventPublisher.publishAll(events);

      // 6. Result DTO 반환
      return new RenderDiagramResult(
        diagram.id,
        diagram.getSvg(),
        diagram.mermaidCode.diagramType,
      );
    } catch (error) {
      // 렌더링 실패 처리
      const renderingError = RenderingError.create(
        error instanceof Error ? error.message : 'Unknown rendering error',
      );

      diagram.markAsFailed(renderingError);

      // Repository에 저장 (실패 상태도 기록)
      await this.diagramRepository.save(diagram);

      // Domain Events 발행
      const events = diagram.pullDomainEvents();
      this.eventPublisher.publishAll(events);

      // 에러 재발생
      throw error;
    }
  }
}

import { RenderDiagramUseCase } from './render-diagram.use-case';
import { RenderDiagramCommand } from './render-diagram.command';
import { IDiagramRepository } from '../../../domain/rendering/diagram.repository.interface';
import { IMermaidRenderer } from '../../../domain/rendering/mermaid-renderer.interface';
import { DomainEventPublisherService } from '../../../infrastructure/events/domain-event-publisher.service';
import { Diagram } from '../../../domain/rendering/diagram.aggregate';
import { RenderStatus } from '../../../domain/rendering/render-status.enum';
import { DiagramType } from '../../../domain/rendering/diagram-type.enum';

describe('RenderDiagramUseCase (Integration)', () => {
  let useCase: RenderDiagramUseCase;
  let mockRepository: jest.Mocked<IDiagramRepository>;
  let mockRenderer: jest.Mocked<IMermaidRenderer>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherService>;

  beforeEach(() => {
    // Mock 객체 생성
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockRenderer = {
      render: jest.fn(),
    } as any;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn(),
    } as any;

    // UseCase 직접 생성
    useCase = new RenderDiagramUseCase(
      mockRepository,
      mockRenderer,
      mockEventPublisher,
    );
  });

  describe('execute - success case', () => {
    it('should render diagram successfully', async () => {
      // Given
      const mermaidCode = 'graph TD\n  A-->B';
      const expectedSvg = '<svg>test diagram</svg>';
      const command = new RenderDiagramCommand(mermaidCode);

      mockRenderer.render.mockResolvedValue(expectedSvg);
      mockRepository.save.mockResolvedValue(undefined);

      // When
      const result = await useCase.execute(command);

      // Then
      expect(result).toBeDefined();
      expect(result.renderedSvg).toBe(expectedSvg);
      expect(result.diagramId).toBeDefined();
      expect(result.diagramType).toBe(DiagramType.FLOWCHART);

      // Verify interactions
      expect(mockRenderer.render).toHaveBeenCalledWith(mermaidCode);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventPublisher.publishAll).toHaveBeenCalledTimes(1);

      // Verify saved diagram
      const savedDiagram = mockRepository.save.mock.calls[0][0] as Diagram;
      expect(savedDiagram.renderStatus).toBe(RenderStatus.SUCCESS);
      expect(savedDiagram.renderedSvg).toBe(expectedSvg);
    });

    it('should publish DiagramCreated and DiagramRendered events', async () => {
      // Given
      const mermaidCode = 'graph TD\n  A-->B';
      const expectedSvg = '<svg>test</svg>';
      const command = new RenderDiagramCommand(mermaidCode);

      mockRenderer.render.mockResolvedValue(expectedSvg);

      // When
      await useCase.execute(command);

      // Then
      expect(mockEventPublisher.publishAll).toHaveBeenCalled();
      const publishedEvents = mockEventPublisher.publishAll.mock.calls[0][0];
      expect(publishedEvents).toHaveLength(2); // DiagramCreated + DiagramRendered
      expect(publishedEvents[0].eventType).toBe('DiagramCreated');
      expect(publishedEvents[1].eventType).toBe('DiagramRendered');
    });
  });

  describe('execute - failure case', () => {
    it('should handle rendering failure and save failed diagram', async () => {
      // Given
      const mermaidCode = 'invalid mermaid code';
      const command = new RenderDiagramCommand(mermaidCode);
      const renderError = new Error('Syntax error in mermaid code');

      mockRenderer.render.mockRejectedValue(renderError);
      mockRepository.save.mockResolvedValue(undefined);

      // When & Then
      await expect(useCase.execute(command)).rejects.toThrow(
        'Syntax error in mermaid code',
      );

      // Verify diagram was saved with FAILED status
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      const savedDiagram = mockRepository.save.mock.calls[0][0] as Diagram;
      expect(savedDiagram.renderStatus).toBe(RenderStatus.FAILED);
      expect(savedDiagram.error).toBeDefined();

      // Verify failed event was published
      expect(mockEventPublisher.publishAll).toHaveBeenCalled();
      const publishedEvents = mockEventPublisher.publishAll.mock.calls[0][0];
      expect(publishedEvents).toHaveLength(2); // DiagramCreated + DiagramRenderFailed
      expect(publishedEvents[0].eventType).toBe('DiagramCreated');
      expect(publishedEvents[1].eventType).toBe('DiagramRenderFailed');
    });
  });

  describe('repository integration', () => {
    it('should call repository.save with correct diagram', async () => {
      // Given
      const mermaidCode = 'sequenceDiagram\n  A->>B: Hello';
      const expectedSvg = '<svg>sequence</svg>';
      const command = new RenderDiagramCommand(mermaidCode);

      mockRenderer.render.mockResolvedValue(expectedSvg);

      // When
      await useCase.execute(command);

      // Then
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      const savedDiagram = mockRepository.save.mock.calls[0][0];
      expect(savedDiagram).toBeInstanceOf(Diagram);
    });
  });

  describe('mermaid renderer integration', () => {
    it('should call renderer with mermaid code', async () => {
      // Given
      const mermaidCode = 'pie title Pets\n  "Dogs" : 386';
      const command = new RenderDiagramCommand(mermaidCode);

      mockRenderer.render.mockResolvedValue('<svg>pie</svg>');

      // When
      await useCase.execute(command);

      // Then
      expect(mockRenderer.render).toHaveBeenCalledWith(mermaidCode);
    });
  });
});

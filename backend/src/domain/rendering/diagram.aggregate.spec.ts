import { Diagram } from './diagram.aggregate';
import { RenderStatus } from './render-status.enum';
import { RenderingError } from './rendering-error.value-object';
import { DiagramType } from './diagram-type.enum';

describe('Diagram Aggregate', () => {
  describe('create', () => {
    it('should create a new Diagram with PENDING status', () => {
      const mermaidCode = 'graph TD\n  A-->B';
      const diagram = Diagram.create(mermaidCode);

      expect(diagram.id).toBeDefined();
      expect(diagram.mermaidCode.rawCode).toBe(mermaidCode);
      expect(diagram.mermaidCode.diagramType).toBe(DiagramType.FLOWCHART);
      expect(diagram.renderStatus).toBe(RenderStatus.PENDING);
      expect(diagram.renderedSvg).toBeNull();
      expect(diagram.error).toBeNull();
      expect(diagram.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error when mermaid code is empty', () => {
      expect(() => Diagram.create('')).toThrow('Mermaid code cannot be empty');
    });

    it('should emit DiagramCreated event', () => {
      const diagram = Diagram.create('graph TD\n  A-->B');
      const events = diagram.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('DiagramCreated');
    });
  });

  describe('markAsRendered', () => {
    it('should mark diagram as successfully rendered', () => {
      const diagram = Diagram.create('graph TD\n  A-->B');
      const svg = '<svg>test</svg>';

      diagram.markAsRendered(svg);

      expect(diagram.renderStatus).toBe(RenderStatus.SUCCESS);
      expect(diagram.renderedSvg).toBe(svg);
      expect(diagram.error).toBeNull();
    });

    it('should throw error when SVG is empty', () => {
      const diagram = Diagram.create('graph TD\n  A-->B');

      expect(() => diagram.markAsRendered('')).toThrow(
        'Rendered SVG cannot be empty',
      );
    });

    it('should emit DiagramRendered event', () => {
      const diagram = Diagram.create('graph TD\n  A-->B');
      diagram.pullDomainEvents(); // Clear creation event

      diagram.markAsRendered('<svg>test</svg>');
      const events = diagram.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('DiagramRendered');
    });
  });

  describe('markAsFailed', () => {
    it('should mark diagram as failed with error', () => {
      const diagram = Diagram.create('invalid code');
      const error = RenderingError.create('Syntax error', 1, 5);

      diagram.markAsFailed(error);

      expect(diagram.renderStatus).toBe(RenderStatus.FAILED);
      expect(diagram.renderedSvg).toBeNull();
      expect(diagram.error).toBe(error);
    });

    it('should emit DiagramRenderFailed event', () => {
      const diagram = Diagram.create('invalid code');
      diagram.pullDomainEvents(); // Clear creation event

      const error = RenderingError.create('Syntax error');
      diagram.markAsFailed(error);
      const events = diagram.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('DiagramRenderFailed');
    });
  });

  describe('updateCode', () => {
    it('should update mermaid code and reset status to PENDING', () => {
      const diagram = Diagram.create('graph TD\n  A-->B');
      diagram.markAsRendered('<svg>test</svg>');
      diagram.pullDomainEvents(); // Clear previous events

      const newCode = 'sequenceDiagram\n  A->>B: Hello';
      diagram.updateCode(newCode);

      expect(diagram.mermaidCode.rawCode).toBe(newCode);
      expect(diagram.mermaidCode.diagramType).toBe(DiagramType.SEQUENCE);
      expect(diagram.renderStatus).toBe(RenderStatus.PENDING);
      expect(diagram.renderedSvg).toBeNull();
      expect(diagram.error).toBeNull();
    });

    it('should not update when code is identical', () => {
      const code = 'graph TD\n  A-->B';
      const diagram = Diagram.create(code);
      diagram.pullDomainEvents(); // Clear creation event

      diagram.updateCode(code);
      const events = diagram.pullDomainEvents();

      expect(events).toHaveLength(0);
    });

    it('should emit DiagramCodeUpdated event', () => {
      const diagram = Diagram.create('graph TD\n  A-->B');
      diagram.pullDomainEvents(); // Clear creation event

      diagram.updateCode('sequenceDiagram\n  A->>B: Hello');
      const events = diagram.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('DiagramCodeUpdated');
    });
  });

  describe('getSvg', () => {
    it('should return SVG when successfully rendered', () => {
      const diagram = Diagram.create('graph TD\n  A-->B');
      const svg = '<svg>test</svg>';
      diagram.markAsRendered(svg);

      expect(diagram.getSvg()).toBe(svg);
    });

    it('should throw error when not successfully rendered', () => {
      const diagram = Diagram.create('graph TD\n  A-->B');

      expect(() => diagram.getSvg()).toThrow(
        'Diagram has not been successfully rendered',
      );
    });
  });

  describe('getError', () => {
    it('should return error when rendering failed', () => {
      const diagram = Diagram.create('invalid code');
      const error = RenderingError.create('Syntax error');
      diagram.markAsFailed(error);

      expect(diagram.getError()).toBe(error);
    });

    it('should throw error when rendering has not failed', () => {
      const diagram = Diagram.create('graph TD\n  A-->B');

      expect(() => diagram.getError()).toThrow(
        'Diagram has not failed rendering',
      );
    });
  });

  describe('pullDomainEvents', () => {
    it('should return all domain events and clear them', () => {
      const diagram = Diagram.create('graph TD\n  A-->B');
      const firstPull = diagram.pullDomainEvents();
      const secondPull = diagram.pullDomainEvents();

      expect(firstPull).toHaveLength(1);
      expect(secondPull).toHaveLength(0);
    });
  });

  describe('reconstitute', () => {
    it('should reconstruct Diagram from existing data', () => {
      const id = 'test-id';
      const code = 'graph TD\n  A-->B';
      const svg = '<svg>test</svg>';
      const createdAt = new Date('2024-01-01');

      const diagram = Diagram.reconstitute(
        id,
        code,
        svg,
        RenderStatus.SUCCESS,
        null,
        createdAt,
      );

      expect(diagram.id).toBe(id);
      expect(diagram.mermaidCode.rawCode).toBe(code);
      expect(diagram.renderedSvg).toBe(svg);
      expect(diagram.renderStatus).toBe(RenderStatus.SUCCESS);
      expect(diagram.error).toBeNull();
      expect(diagram.createdAt).toBe(createdAt);
    });
  });

  describe('Invariants', () => {
    it('should validate SUCCESS status requires SVG', () => {
      expect(() => {
        Diagram.reconstitute(
          'test-id',
          'graph TD\n  A-->B',
          null, // SVG 없음
          RenderStatus.SUCCESS,
          null,
          new Date(),
        );
      }).toThrow('SUCCESS status requires rendered SVG');
    });

    it('should validate FAILED status requires error', () => {
      expect(() => {
        Diagram.reconstitute(
          'test-id',
          'graph TD\n  A-->B',
          null,
          RenderStatus.FAILED,
          null, // Error 없음
          new Date(),
        );
      }).toThrow('FAILED status requires error');
    });
  });
});

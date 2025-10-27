import { MermaidCode } from './mermaid-code.value-object';
import { DiagramType } from './diagram-type.enum';

describe('MermaidCode Value Object', () => {
  describe('create', () => {
    it('should create MermaidCode with valid code', () => {
      const code = 'graph TD\n  A-->B';
      const mermaidCode = MermaidCode.create(code);

      expect(mermaidCode.rawCode).toBe(code);
      expect(mermaidCode.diagramType).toBe(DiagramType.FLOWCHART);
    });

    it('should trim whitespace from code', () => {
      const code = '  graph TD\n  A-->B  ';
      const mermaidCode = MermaidCode.create(code);

      expect(mermaidCode.rawCode).toBe('graph TD\n  A-->B');
    });

    it('should throw error when code is empty', () => {
      expect(() => MermaidCode.create('')).toThrow(
        'Mermaid code cannot be empty',
      );
    });

    it('should throw error when code is only whitespace', () => {
      expect(() => MermaidCode.create('   ')).toThrow(
        'Mermaid code cannot be empty',
      );
    });
  });

  describe('detectDiagramType', () => {
    it('should detect FLOWCHART with graph keyword', () => {
      const code = MermaidCode.create('graph TD\n  A-->B');
      expect(code.diagramType).toBe(DiagramType.FLOWCHART);
    });

    it('should detect FLOWCHART with flowchart keyword', () => {
      const code = MermaidCode.create('flowchart LR\n  A-->B');
      expect(code.diagramType).toBe(DiagramType.FLOWCHART);
    });

    it('should detect SEQUENCE diagram', () => {
      const code = MermaidCode.create('sequenceDiagram\n  A->>B: Hello');
      expect(code.diagramType).toBe(DiagramType.SEQUENCE);
    });

    it('should detect CLASS diagram', () => {
      const code = MermaidCode.create('classDiagram\n  Class01 <|-- Class02');
      expect(code.diagramType).toBe(DiagramType.CLASS);
    });

    it('should detect STATE diagram', () => {
      const code = MermaidCode.create('stateDiagram\n  [*] --> State1');
      expect(code.diagramType).toBe(DiagramType.STATE);
    });

    it('should detect ER diagram', () => {
      const code = MermaidCode.create('erDiagram\n  CUSTOMER ||--o{ ORDER : places');
      expect(code.diagramType).toBe(DiagramType.ER);
    });

    it('should detect GANTT diagram', () => {
      const code = MermaidCode.create('gantt\n  title A Gantt Diagram');
      expect(code.diagramType).toBe(DiagramType.GANTT);
    });

    it('should detect PIE diagram', () => {
      const code = MermaidCode.create('pie title Pets\n  "Dogs" : 386');
      expect(code.diagramType).toBe(DiagramType.PIE);
    });

    it('should detect GIT diagram', () => {
      const code = MermaidCode.create('gitGraph\n  commit');
      expect(code.diagramType).toBe(DiagramType.GIT);
    });

    it('should detect JOURNEY diagram', () => {
      const code = MermaidCode.create('journey\n  title My working day');
      expect(code.diagramType).toBe(DiagramType.JOURNEY);
    });

    it('should detect MINDMAP diagram', () => {
      const code = MermaidCode.create('mindmap\n  root((mindmap))');
      expect(code.diagramType).toBe(DiagramType.MINDMAP);
    });

    it('should detect TIMELINE diagram', () => {
      const code = MermaidCode.create('timeline\n  title History');
      expect(code.diagramType).toBe(DiagramType.TIMELINE);
    });

    it('should return UNKNOWN for unrecognized diagram type', () => {
      const code = MermaidCode.create('invalid diagram type');
      expect(code.diagramType).toBe(DiagramType.UNKNOWN);
    });

    it('should be case-insensitive', () => {
      const code = MermaidCode.create('GRAPH TD\n  A-->B');
      expect(code.diagramType).toBe(DiagramType.FLOWCHART);
    });
  });

  describe('equals', () => {
    it('should return true for identical codes', () => {
      const code1 = MermaidCode.create('graph TD\n  A-->B');
      const code2 = MermaidCode.create('graph TD\n  A-->B');

      expect(code1.equals(code2)).toBe(true);
    });

    it('should return false for different codes', () => {
      const code1 = MermaidCode.create('graph TD\n  A-->B');
      const code2 = MermaidCode.create('graph TD\n  A-->C');

      expect(code1.equals(code2)).toBe(false);
    });
  });
});

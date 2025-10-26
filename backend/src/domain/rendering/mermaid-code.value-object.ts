import { DiagramType } from './diagram-type.enum';

/**
 * Mermaid 코드 Value Object
 *
 * 책임:
 * - 코드 유효성 검증
 * - 다이어그램 타입 자동 감지
 */
export class MermaidCode {
  private readonly _rawCode: string;
  private readonly _diagramType: DiagramType;

  private constructor(rawCode: string, diagramType: DiagramType) {
    this._rawCode = rawCode;
    this._diagramType = diagramType;
  }

  /**
   * Mermaid 코드로부터 MermaidCode 생성
   */
  static create(rawCode: string): MermaidCode {
    // 비즈니스 규칙: 코드는 비어있을 수 없음
    if (!rawCode || rawCode.trim().length === 0) {
      throw new Error('Mermaid code cannot be empty');
    }

    const diagramType = this.detectDiagramType(rawCode);
    return new MermaidCode(rawCode.trim(), diagramType);
  }

  /**
   * 다이어그램 타입 자동 감지
   */
  private static detectDiagramType(code: string): DiagramType {
    const trimmedCode = code.trim().toLowerCase();

    // 각 다이어그램 타입의 시작 키워드 매칭
    if (
      trimmedCode.startsWith('graph') ||
      trimmedCode.startsWith('flowchart')
    ) {
      return DiagramType.FLOWCHART;
    }
    if (trimmedCode.startsWith('sequencediagram')) {
      return DiagramType.SEQUENCE;
    }
    if (trimmedCode.startsWith('classdiagram')) {
      return DiagramType.CLASS;
    }
    if (trimmedCode.startsWith('statediagram')) {
      return DiagramType.STATE;
    }
    if (trimmedCode.startsWith('erdiagram')) {
      return DiagramType.ER;
    }
    if (trimmedCode.startsWith('gantt')) {
      return DiagramType.GANTT;
    }
    if (trimmedCode.startsWith('pie')) {
      return DiagramType.PIE;
    }
    if (trimmedCode.startsWith('gitgraph')) {
      return DiagramType.GIT;
    }
    if (trimmedCode.startsWith('journey')) {
      return DiagramType.JOURNEY;
    }
    if (trimmedCode.startsWith('mindmap')) {
      return DiagramType.MINDMAP;
    }
    if (trimmedCode.startsWith('timeline')) {
      return DiagramType.TIMELINE;
    }

    return DiagramType.UNKNOWN;
  }

  get rawCode(): string {
    return this._rawCode;
  }

  get diagramType(): DiagramType {
    return this._diagramType;
  }

  /**
   * Value Object는 불변이므로 equals 메서드 제공
   */
  equals(other: MermaidCode): boolean {
    return this._rawCode === other._rawCode;
  }
}

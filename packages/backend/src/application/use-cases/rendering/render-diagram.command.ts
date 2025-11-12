/**
 * Render Diagram Command
 *
 * Mermaid 코드를 다이어그램으로 렌더링 요청
 */
export class RenderDiagramCommand {
  constructor(public readonly mermaidCode: string) {}
}

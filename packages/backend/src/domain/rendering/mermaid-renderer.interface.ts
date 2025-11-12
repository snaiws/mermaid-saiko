/**
 * Mermaid Renderer 인터페이스
 *
 * Mermaid 코드를 SVG로 렌더링하는 외부 서비스
 * Infrastructure Layer에서 Mermaid.js 또는 Puppeteer로 구현
 */
export interface IMermaidRenderer {
  /**
   * Mermaid 코드를 SVG로 렌더링
   *
   * @param mermaidCode - Mermaid 코드
   * @returns 렌더링된 SVG 문자열
   * @throws {RenderingError} 렌더링 실패 시
   */
  render(mermaidCode: string): Promise<string>;
}

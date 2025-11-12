/**
 * Export SVG Command
 *
 * 다이어그램을 SVG 파일로 export 요청
 */
export class ExportSvgCommand {
  constructor(public readonly mermaidCode: string) {}
}

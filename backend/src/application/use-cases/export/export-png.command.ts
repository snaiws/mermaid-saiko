/**
 * Export PNG Command
 *
 * 다이어그램을 PNG 이미지로 export 요청
 */
export class ExportPngCommand {
  constructor(
    public readonly mermaidCode: string,
    public readonly width?: number,
    public readonly height?: number,
    public readonly backgroundColor?: string,
  ) {}
}

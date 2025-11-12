/**
 * Diagram 관련 타입 정의
 */

export const DiagramType = {
  FLOWCHART: 'flowchart',
  SEQUENCE: 'sequence',
  CLASS: 'class',
  STATE: 'state',
  ER: 'er',
  GANTT: 'gantt',
  PIE: 'pie',
  JOURNEY: 'journey',
  UNKNOWN: 'unknown',
} as const;

export type DiagramType = (typeof DiagramType)[keyof typeof DiagramType];

export const RenderStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export type RenderStatus = (typeof RenderStatus)[keyof typeof RenderStatus];

export const ImageFormat = {
  PNG: 'png',
  SVG: 'svg',
} as const;

export type ImageFormat = (typeof ImageFormat)[keyof typeof ImageFormat];

export interface RenderDiagramRequest {
  mermaidCode: string;
}

export interface RenderDiagramResponse {
  diagramId: string;
  renderedSvg: string;
  diagramType: DiagramType;
  createdAt: string;
}

export interface GetDiagramResponse {
  diagramId: string;
  renderedSvg: string | null;
  diagramType: DiagramType;
  mermaidCode: string;
  status: RenderStatus;
  createdAt: string;
  error?: {
    message: string;
    code?: string;
  };
}

export interface ExportOptions {
  fileName?: string;
  width?: number;
  height?: number;
  scale?: number;
  backgroundColor?: string;
}

export interface ExportPngRequest {
  mermaidCode: string;
  options?: ExportOptions;
}

export interface ExportSvgRequest {
  mermaidCode: string;
  options?: {
    fileName?: string;
  };
}

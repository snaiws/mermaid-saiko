import apiClient from '../utils/api';
import type { ExportPngRequest, ExportSvgRequest } from '../../types/diagram';

/**
 * Export API 클라이언트
 */
export const exportApi = {
  /**
   * POST /api/v1/export/png
   * PNG 이미지로 export
   */
  async exportPng(request: ExportPngRequest): Promise<Blob> {
    const response = await apiClient.post<Blob>(
      '/api/v1/export/png',
      request,
      {
        responseType: 'blob',
      }
    );

    return response.data;
  },

  /**
   * POST /api/v1/export/svg
   * SVG 이미지로 export
   */
  async exportSvg(request: ExportSvgRequest): Promise<Blob> {
    const response = await apiClient.post<Blob>(
      '/api/v1/export/svg',
      request,
      {
        responseType: 'blob',
      }
    );

    return response.data;
  },

  /**
   * Blob을 다운로드하는 헬퍼 함수
   */
  downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

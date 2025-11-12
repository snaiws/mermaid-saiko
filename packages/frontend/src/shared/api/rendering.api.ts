import apiClient from '../utils/api';
import type {
  RenderDiagramRequest,
  RenderDiagramResponse,
  GetDiagramResponse,
} from '../../types/diagram';
import type { ApiSuccessResponse } from '../../types/api';

/**
 * Rendering API 클라이언트
 */
export const renderingApi = {
  /**
   * POST /api/v1/rendering/render
   * Mermaid 코드를 다이어그램으로 렌더링
   */
  async renderDiagram(
    request: RenderDiagramRequest
  ): Promise<RenderDiagramResponse> {
    const response = await apiClient.post<
      ApiSuccessResponse<RenderDiagramResponse>
    >('/api/v1/rendering/render', request);

    return response.data.data;
  },

  /**
   * GET /api/v1/rendering/diagram/:id
   * 다이어그램 조회
   */
  async getDiagram(diagramId: string): Promise<GetDiagramResponse> {
    const response = await apiClient.get<
      ApiSuccessResponse<GetDiagramResponse>
    >(`/api/v1/rendering/diagram/${diagramId}`);

    return response.data.data;
  },
};

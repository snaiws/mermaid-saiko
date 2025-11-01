import { useCallback } from 'react';
import { renderingApi } from '../../../shared/api/rendering.api';
import { useRenderingStore } from '../stores/renderingStore';
import { useEditorStore } from '../../editor/stores/editorStore';

export const useRenderDiagram = () => {
  const { setRendering, setSuccess, setError } = useRenderingStore();
  const { code } = useEditorStore();

  const renderDiagram = useCallback(async () => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError('Code is empty');
      return;
    }

    setRendering();

    try {
      const result = await renderingApi.renderDiagram({
        mermaidCode: trimmedCode,
      });

      setSuccess(result.diagramId, result.renderedSvg, result.diagramType);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to render diagram';
      setError(errorMessage);
    }
  }, [code, setRendering, setSuccess, setError]);

  return { renderDiagram };
};

import { useCallback } from 'react';
import mermaid from 'mermaid';
import { useRenderingStore } from '../stores/renderingStore';
import { useEditorStore } from '../../editor/stores/editorStore';
import { DiagramType } from '../../../types/diagram';
import type { DiagramType as DiagramTypeType } from '../../../types/diagram';
import { MERMAID_CONFIG } from '@mermaid-saiko/shared';

// Mermaid 초기화 (shared 패키지에서 공통 설정 사용)
mermaid.initialize(MERMAID_CONFIG);

export const useRenderDiagram = () => {
  const { setRendering, setSuccess, setError } = useRenderingStore();
  const { code } = useEditorStore();

  const renderDiagram = useCallback(async (codeOverride?: string) => {
    // codeOverride가 제공되면 사용, 아니면 store의 code 사용
    const codeToRender = codeOverride ?? code;
    const trimmedCode = codeToRender.trim();

    if (!trimmedCode) {
      setError('Code is empty');
      return;
    }

    setRendering();

    try {
      // Mermaid.js로 직접 렌더링 (프론트엔드)
      const { svg } = await mermaid.render(
        `mermaid-diagram-${Date.now()}`,
        trimmedCode
      );

      // 다이어그램 타입 추출 (첫 줄에서)
      const firstLine = trimmedCode.split('\n')[0].trim();
      let diagramType: DiagramTypeType = DiagramType.UNKNOWN;

      if (firstLine.startsWith('graph') || firstLine.startsWith('flowchart')) {
        diagramType = DiagramType.FLOWCHART;
      } else if (firstLine.startsWith('sequenceDiagram')) {
        diagramType = DiagramType.SEQUENCE;
      } else if (firstLine.startsWith('classDiagram')) {
        diagramType = DiagramType.CLASS;
      } else if (firstLine.startsWith('stateDiagram')) {
        diagramType = DiagramType.STATE;
      } else if (firstLine.startsWith('erDiagram')) {
        diagramType = DiagramType.ER;
      } else if (firstLine.startsWith('gantt')) {
        diagramType = DiagramType.GANTT;
      } else if (firstLine.startsWith('pie')) {
        diagramType = DiagramType.PIE;
      } else if (firstLine.startsWith('journey')) {
        diagramType = DiagramType.JOURNEY;
      }

      // 프론트엔드 렌더링이므로 diagramId는 로컬 생성
      const diagramId = `local-${Date.now()}`;

      setSuccess(diagramId, svg, diagramType);
    } catch (error: any) {
      const errorMessage =
        error.message ||
        'Failed to render diagram';
      setError(errorMessage);
    }
  }, [code, setRendering, setSuccess, setError]);

  return { renderDiagram };
};

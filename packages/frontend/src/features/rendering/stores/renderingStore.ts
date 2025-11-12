import { create } from 'zustand';
import type { DiagramType, RenderStatus } from '../../../types/diagram';

interface RenderingStore {
  // State
  diagramId: string | null;
  renderedSvg: string | null;
  diagramType: DiagramType | null;
  status: RenderStatus;
  error: string | null;
  isLoading: boolean;

  // Actions
  setRendering: () => void;
  setSuccess: (diagramId: string, svg: string, type: DiagramType) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useRenderingStore = create<RenderingStore>((set) => ({
  // Initial State
  diagramId: null,
  renderedSvg: null,
  diagramType: null,
  status: 'pending' as RenderStatus,
  error: null,
  isLoading: false,

  // Actions
  setRendering: () => {
    set({
      status: 'pending' as RenderStatus,
      isLoading: true,
      error: null,
    });
  },

  setSuccess: (diagramId, svg, type) => {
    set({
      diagramId,
      renderedSvg: svg,
      diagramType: type,
      status: 'success' as RenderStatus,
      isLoading: false,
      error: null,
    });
  },

  setError: (error) => {
    set({
      status: 'failed' as RenderStatus,
      isLoading: false,
      error,
    });
  },

  reset: () => {
    set({
      diagramId: null,
      renderedSvg: null,
      diagramType: null,
      status: 'pending' as RenderStatus,
      error: null,
      isLoading: false,
    });
  },
}));

import { create } from 'zustand';
import type { ImageFormat, ExportOptions } from '../../../types/diagram';

interface ExportStore {
  // State
  format: ImageFormat;
  options: ExportOptions;
  isExporting: boolean;
  error: string | null;

  // Actions
  setFormat: (format: ImageFormat) => void;
  setOptions: (options: ExportOptions) => void;
  setExporting: (isExporting: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultOptions: ExportOptions = {
  fileName: 'diagram',
  width: undefined,
  height: undefined,
  scale: 1,
  backgroundColor: 'white',
};

export const useExportStore = create<ExportStore>((set) => ({
  // Initial State
  format: 'png' as ImageFormat,
  options: defaultOptions,
  isExporting: false,
  error: null,

  // Actions
  setFormat: (format) => {
    set({ format });
  },

  setOptions: (options) => {
    set({ options });
  },

  setExporting: (isExporting) => {
    set({ isExporting, error: isExporting ? null : undefined });
  },

  setError: (error) => {
    set({ error, isExporting: false });
  },

  reset: () => {
    set({
      format: 'png' as ImageFormat,
      options: defaultOptions,
      isExporting: false,
      error: null,
    });
  },
}));

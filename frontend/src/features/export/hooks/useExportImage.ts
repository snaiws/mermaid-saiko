import { useCallback } from 'react';
import { exportApi } from '../../../shared/api/export.api';
import { useExportStore } from '../stores/exportStore';
import { useEditorStore } from '../../editor/stores/editorStore';

export const useExportImage = () => {
  const { format, options, setExporting, setError } = useExportStore();
  const { code } = useEditorStore();

  const exportImage = useCallback(async () => {
    // Mermaid code 블록 제거
    const cleanedCode = code
      .replace(/^```mermaid\n?/i, '')
      .replace(/\n?```$/, '')
      .trim();

    if (!cleanedCode) {
      setError('Code is empty');
      return;
    }

    setExporting(true);

    try {
      let blob: Blob;

      if (format === 'png') {
        blob = await exportApi.exportPng({
          mermaidCode: cleanedCode,
          options,
        });
      } else {
        blob = await exportApi.exportSvg({
          mermaidCode: cleanedCode,
          options: { fileName: options.fileName },
        });
      }

      // 다운로드
      const fileName = options.fileName
        ? `${options.fileName}.${format}`
        : `diagram.${format}`;
      exportApi.downloadBlob(blob, fileName);

      setExporting(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to export image';
      setError(errorMessage);
    }
  }, [code, format, options, setExporting, setError]);

  return { exportImage };
};

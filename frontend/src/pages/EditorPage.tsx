import React, { useEffect } from 'react';
import { CodeEditor } from '../features/editor/components/CodeEditor';
import { DiagramPreview } from '../features/rendering/components/DiagramPreview';
import { ExportButton } from '../features/export/components/ExportButton';
import { useRenderDiagram } from '../features/rendering/hooks/useRenderDiagram';

export const EditorPage: React.FC = () => {
  const { renderDiagram } = useRenderDiagram();

  // 초기 렌더링
  useEffect(() => {
    renderDiagram();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Mermaid Saiko</h1>

        <div className="flex items-center gap-2">
          <ExportButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-1/2 border-r">
          <div className="h-full flex flex-col">
            <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">Mermaid Code</h2>
              <span className="text-xs text-gray-500">
                Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-700">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-700">Enter</kbd> to render
              </span>
            </div>
            <div className="flex-1">
              <CodeEditor />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2">
          <div className="h-full flex flex-col">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h2 className="font-semibold text-gray-700">Preview</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <DiagramPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../stores/editorStore';
import { useRenderDiagram } from '../../rendering/hooks/useRenderDiagram';
import type { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';

export const CodeEditor: React.FC = () => {
  const { code, updateCode } = useEditorStore();
  const { renderDiagram } = useRenderDiagram();

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        updateCode(value, { line: 1, column: 1 });
      }
    },
    [updateCode]
  );

  const handleEditorMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      // Ctrl+Enter 키 바인딩 추가
      editor.addCommand(
        // eslint-disable-next-line no-bitwise
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        () => {
          renderDiagram();
        }
      );
    },
    [renderDiagram]
  );

  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={code}
      onChange={handleChange}
      onMount={handleEditorMount}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
      }}
    />
  );
};

import React, { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../stores/editorStore';

export const CodeEditor: React.FC = () => {
  const { code, updateCode } = useEditorStore();

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        updateCode(value, { line: 1, column: 1 });
      }
    },
    [updateCode]
  );

  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={code}
      onChange={handleChange}
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

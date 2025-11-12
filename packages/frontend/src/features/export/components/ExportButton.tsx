import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { useExportStore } from '../stores/exportStore';
import { useExportImage } from '../hooks/useExportImage';

export const ExportButton: React.FC = () => {
  const { format, setFormat, options, setOptions, isExporting, error } =
    useExportStore();
  const { exportImage } = useExportImage();
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative">
      <Button
        onClick={exportImage}
        disabled={isExporting}
        variant="primary"
      >
        {isExporting ? 'Exporting...' : `Export ${format.toUpperCase()}`}
      </Button>

      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm max-w-xs">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowOptions(!showOptions)}
        className="ml-2 px-2 py-2 text-gray-600 hover:text-gray-800"
      >
        ⚙️
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg p-4 z-10">
          <h3 className="font-semibold mb-2">Export Options</h3>

          <div className="mb-3">
            <label className="block text-sm mb-1">Format:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1">File Name:</label>
            <input
              type="text"
              value={options.fileName || ''}
              onChange={(e) =>
                setOptions({ ...options, fileName: e.target.value })
              }
              className="w-full border rounded px-2 py-1"
              placeholder="diagram"
            />
          </div>

          {format === 'png' && (
            <>
              <div className="mb-3">
                <label className="block text-sm mb-1">Width (px):</label>
                <input
                  type="number"
                  value={options.width || ''}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      width: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full border rounded px-2 py-1"
                  placeholder="Auto"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm mb-1">Height (px):</label>
                <input
                  type="number"
                  value={options.height || ''}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      height: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full border rounded px-2 py-1"
                  placeholder="Auto"
                />
              </div>
            </>
          )}

          <button
            onClick={() => setShowOptions(false)}
            className="w-full mt-2 px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useRenderingStore } from '../stores/renderingStore';
import { Loading } from '../../../shared/components/Loading';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';

export const DiagramPreview: React.FC = () => {
  const { renderedSvg, isLoading, error, status } = useRenderingStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && renderedSvg) {
      containerRef.current.innerHTML = renderedSvg;
    }
  }, [renderedSvg]);

  if (isLoading) {
    return <Loading message="Rendering diagram..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!renderedSvg && status === 'pending') {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Enter Mermaid code to see preview</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={8}
        centerOnInit
        wheel={{ step: 0.1 }}
        doubleClick={{ mode: 'reset' }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* 확대/축소 컨트롤 */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
              <button
                onClick={() => zoomIn()}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-bold"
                title="Zoom In (Scroll Up)"
              >
                +
              </button>
              <button
                onClick={() => zoomOut()}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-bold"
                title="Zoom Out (Scroll Down)"
              >
                −
              </button>
              <button
                onClick={() => resetTransform()}
                className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs"
                title="Reset View (Double Click)"
              >
                Reset
              </button>
            </div>

            {/* 다이어그램 컨테이너 */}
            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="flex items-center justify-center"
            >
              <div
                ref={containerRef}
                className="inline-block"
              ></div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

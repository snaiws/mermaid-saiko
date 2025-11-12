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

      // SVG 요소의 크기 속성을 동적으로 조정
      const svgElement = containerRef.current.querySelector('svg');
      if (svgElement) {
        // 원본 크기 저장
        const originalWidth = svgElement.getAttribute('width');
        const originalHeight = svgElement.getAttribute('height');
        const viewBox = svgElement.getAttribute('viewBox');

        // viewBox가 없으면 원본 크기를 기반으로 생성
        if (!viewBox && originalWidth && originalHeight) {
          svgElement.setAttribute('viewBox', `0 0 ${originalWidth} ${originalHeight}`);
        }

        // width, height를 100%로 설정하여 컨테이너에 맞게 조정
        svgElement.removeAttribute('width');
        svgElement.removeAttribute('height');
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        svgElement.style.maxWidth = 'none';
        svgElement.style.maxHeight = 'none';
      }
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
              wrapperClass="w-full h-full flex items-center justify-center"
              contentClass="inline-flex"
            >
              <div
                ref={containerRef}
                className="inline-block min-w-0"
                style={{ maxWidth: '100%' }}
              ></div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

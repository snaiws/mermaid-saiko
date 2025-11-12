import React, { useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useRenderingStore } from '../stores/renderingStore';
import { Loading } from '../../../shared/components/Loading';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';

export const DiagramPreview: React.FC = () => {
  const { renderedSvg, isLoading, error, status } = useRenderingStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && renderedSvg) {
      containerRef.current.innerHTML = renderedSvg;

      const svgElement = containerRef.current.querySelector('svg');
      if (svgElement) {
        // viewBox 제거하고 고정 width/height만 사용
        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
          const [, , width, height] = viewBox.split(' ').map(Number);
          svgElement.removeAttribute('viewBox');
          svgElement.setAttribute('width', width.toString());
          svgElement.setAttribute('height', height.toString());
        }

        svgElement.style.maxWidth = 'none';
        svgElement.setAttribute('draggable', 'false');
        svgElement.style.userSelect = 'none';
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
    <div ref={wrapperRef} className="w-full h-full bg-white overflow-hidden">
      <TransformWrapper
        initialScale={0.5}
        minScale={0.1}
        maxScale={8}
        centerOnInit
        wheel={{ step: 0.1 }}
        doubleClick={{ mode: 'reset' }}
      >
        <TransformComponent
          wrapperClass="w-full h-full"
        >
          <div
            ref={containerRef}
            style={{
              width: '400%',
              height: '400%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          ></div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

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
    if (containerRef.current && renderedSvg && wrapperRef.current) {
      containerRef.current.innerHTML = renderedSvg;

      const svgElement = containerRef.current.querySelector('svg');
      if (svgElement) {
        // SVG의 실제 콘텐츠 bbox 계산
        const bbox = svgElement.getBBox();

        // preview 창 크기 가져오기
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const wrapperWidth = wrapperRect.width;
        const wrapperHeight = wrapperRect.height;

        // bbox 주변에 여유 공간 추가 (20% padding)
        const padding = 0.2;
        const paddedWidth = bbox.width * (1 + padding);
        const paddedHeight = bbox.height * (1 + padding);
        const paddedX = bbox.x - (paddedWidth - bbox.width) / 2;
        const paddedY = bbox.y - (paddedHeight - bbox.height) / 2;

        // wrapper 비율에 맞게 viewBox 확장
        const bboxRatio = paddedWidth / paddedHeight;
        const wrapperRatio = wrapperWidth / wrapperHeight;

        let finalWidth = paddedWidth;
        let finalHeight = paddedHeight;
        let finalX = paddedX;
        let finalY = paddedY;

        if (wrapperRatio > bboxRatio) {
          // wrapper가 더 넓음 - width 확장
          finalWidth = paddedHeight * wrapperRatio;
          finalX = paddedX - (finalWidth - paddedWidth) / 2;
        } else {
          // wrapper가 더 높음 - height 확장
          finalHeight = paddedWidth / wrapperRatio;
          finalY = paddedY - (finalHeight - paddedHeight) / 2;
        }

        // viewBox 설정
        svgElement.setAttribute('viewBox', `${finalX} ${finalY} ${finalWidth} ${finalHeight}`);

        svgElement.removeAttribute('width');
        svgElement.removeAttribute('height');
        svgElement.style.width = `${wrapperWidth}px`;
        svgElement.style.height = `${wrapperHeight}px`;
        svgElement.style.maxWidth = 'none';
        svgElement.style.maxHeight = 'none';
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
        initialScale={1}
        minScale={0.1}
        maxScale={8}
        centerOnInit
        wheel={{ step: 0.1 }}
        doubleClick={{ mode: 'reset' }}
      >
        <TransformComponent
          wrapperClass="w-full h-full"
          contentClass="w-full h-full"
        >
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '100%',
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

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { IImageConverter } from '../../domain/export/image-converter.interface';
import { ImageFormat } from '../../domain/export/image-format.enum';

/**
 * Puppeteer 기반 Image Converter
 *
 * SVG를 PNG/JPEG로 변환
 */
@Injectable()
export class ImagePuppeteerConverterService
  implements IImageConverter, OnModuleInit, OnModuleDestroy
{
  private browser: Browser | null = null;

  async onModuleInit() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async convertToPng(
    svg: string,
    options?: {
      width?: number;
      height?: number;
      scale?: number;
      backgroundColor?: string;
    },
  ): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('Browser is not initialized');
    }

    const page = await this.browser.newPage();

    // 배경색 설정
    const backgroundColor = options?.backgroundColor || 'white';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @font-face {
              font-family: 'Pretendard';
              font-weight: 400;
              font-style: normal;
              font-display: swap;
              src: url('http://localhost:3000/fonts/Pretendard-Regular.woff2') format('woff2');
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            body {
              background-color: ${backgroundColor};
              display: flex;
              align-items: flex-start;
              justify-content: flex-start;
              font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            #svg-container {
              display: inline-block;
              line-height: 0;
              padding: 20px;
            }
            #svg-container svg {
              display: block;
            }
            #svg-container svg text,
            #svg-container svg tspan {
              font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            }
          </style>
        </head>
        <body>
          <div id="svg-container">${svg}</div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // 폰트가 완전히 로드될 때까지 대기 (타임아웃 추가)
    await page.evaluateHandle('document.fonts.ready').catch(() => {
      console.warn('Font loading timeout, proceeding anyway');
    });

    // SVG의 실제 렌더링된 크기 가져오기 및 여백 추가
    const dimensions = await page.evaluate(() => {
      const svgElement = document.querySelector('svg');
      if (!svgElement) return { width: 800, height: 600 };

      // SVG의 모든 요소의 실제 bounding box 계산
      const bbox = svgElement.getBBox();

      // 여백 추가 (텍스트 잘림 방지)
      const padding = 40; // 40px 여백
      const totalWidth = bbox.width + padding * 2;
      const totalHeight = bbox.height + padding * 2;
      const viewBoxX = bbox.x - padding;
      const viewBoxY = bbox.y - padding;

      // 새로운 viewBox 설정
      svgElement.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${totalWidth} ${totalHeight}`);
      svgElement.setAttribute('width', totalWidth.toString());
      svgElement.setAttribute('height', totalHeight.toString());

      return { width: totalWidth, height: totalHeight };
    });

    // 뷰포트 설정 (고해상도)
    const scale = options?.scale || 2; // 2x DPI for high quality
    const width = options?.width || dimensions.width;
    const height = options?.height || dimensions.height;

    await page.setViewport({
      width: Math.ceil(width),
      height: Math.ceil(height),
      deviceScaleFactor: scale, // 고해상도 렌더링
    });

    // SVG 엘리먼트만 정확히 캡처
    const svgElement = await page.$('#svg-container');
    if (!svgElement) {
      throw new Error('SVG element not found');
    }

    // 스크린샷 촬영
    const screenshot = await svgElement.screenshot({
      type: 'png',
      omitBackground: backgroundColor === 'transparent',
    });

    await page.close();

    return screenshot as Buffer;
  }

  async cleanSvg(svg: string): Promise<string> {
    // SVG를 정리하여 반환 (현재는 그대로 반환)
    return svg;
  }
}

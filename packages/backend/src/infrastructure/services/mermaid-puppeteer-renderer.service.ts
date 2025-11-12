import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { IMermaidRenderer } from '../../domain/rendering/mermaid-renderer.interface';
import {
  MERMAID_VERSION,
  MERMAID_CONFIG,
  MERMAID_CUSTOM_CSS,
  PRETENDARD_FONT_CSS,
} from '@mermaid-saiko/shared';

/**
 * Puppeteer 기반 Mermaid Renderer
 *
 * headless 브라우저에서 mermaid.js를 실행하여 SVG 생성
 */
@Injectable()
export class MermaidPuppeteerRendererService
  implements IMermaidRenderer, OnModuleInit, OnModuleDestroy
{
  private browser: Browser | null = null;

  async onModuleInit() {
    // NestJS 모듈 초기화 시 브라우저 실행
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async onModuleDestroy() {
    // NestJS 모듈 종료 시 브라우저 닫기
    if (this.browser) {
      await this.browser.close();
    }
  }

  async render(mermaidCode: string): Promise<string> {
    if (!this.browser) {
      throw new Error('Browser is not initialized');
    }

    const page = await this.browser.newPage();

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.min.js"></script>
          <style>
            ${PRETENDARD_FONT_CSS}
            ${MERMAID_CUSTOM_CSS}
          </style>
        </head>
        <body>
          <div id="mermaid-container">${mermaidCode}</div>
          <script>
            mermaid.initialize(${JSON.stringify(MERMAID_CONFIG)});
            async function renderDiagram() {
              const container = document.getElementById('mermaid-container');
              const { svg } = await mermaid.render('diagram', container.textContent);
              container.innerHTML = svg;
            }
            renderDiagram();
          </script>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // 폰트가 완전히 로드될 때까지 대기 (타임아웃 추가)
    await page.evaluateHandle('document.fonts.ready').catch(() => {
      console.warn('Font loading timeout, proceeding anyway');
    });

    // Mermaid 렌더링 완료 대기
    await page.waitForSelector('#mermaid-container svg', { timeout: 5000 });

    // SVG 추출 및 크기 속성 조정
    const svg = await page.evaluate(() => {
      const svgElement = document.querySelector('#mermaid-container svg');
      if (!svgElement) return null;

      // 원본 크기 가져오기
      const width = svgElement.getAttribute('width');
      const height = svgElement.getAttribute('height');
      const existingViewBox = svgElement.getAttribute('viewBox');

      // viewBox가 없으면 원본 크기로 생성
      if (!existingViewBox && width && height) {
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }

      // width, height 속성 제거 (viewBox만 유지)
      svgElement.removeAttribute('width');
      svgElement.removeAttribute('height');

      return svgElement.outerHTML;
    });

    await page.close();

    if (!svg) {
      throw new Error('Failed to render Mermaid diagram');
    }

    return svg;
  }
}

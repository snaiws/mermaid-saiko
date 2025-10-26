import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { IMermaidRenderer } from '../../domain/rendering/mermaid-renderer.interface';

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
          <script src="https://cdn.jsdelivr.net/npm/mermaid@11.4.0/dist/mermaid.min.js"></script>
        </head>
        <body>
          <div id="mermaid-container">${mermaidCode}</div>
          <script>
            mermaid.initialize({ startOnLoad: false, theme: 'default' });
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

    await page.setContent(html);

    // Mermaid 렌더링 완료 대기
    await page.waitForSelector('#mermaid-container svg', { timeout: 5000 });

    // SVG 추출
    const svg = await page.evaluate(() => {
      const svgElement = document.querySelector('#mermaid-container svg');
      return svgElement ? svgElement.outerHTML : null;
    });

    await page.close();

    if (!svg) {
      throw new Error('Failed to render Mermaid diagram');
    }

    return svg;
  }
}

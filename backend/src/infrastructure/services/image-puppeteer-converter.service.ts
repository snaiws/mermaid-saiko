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

  async convert(
    svg: string,
    format: ImageFormat,
    options?: {
      width?: number;
      height?: number;
      backgroundColor?: string;
    },
  ): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('Browser is not initialized');
    }

    if (format === ImageFormat.SVG) {
      // SVG는 변환 불필요, 그대로 반환
      return Buffer.from(svg);
    }

    const page = await this.browser.newPage();

    // 배경색 설정
    const backgroundColor = options?.backgroundColor || 'white';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: ${backgroundColor};
            }
            #svg-container {
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div id="svg-container">${svg}</div>
        </body>
      </html>
    `;

    await page.setContent(html);

    // SVG 크기 가져오기
    const svgDimensions = await page.evaluate(() => {
      const svgElement = document.querySelector('svg');
      if (!svgElement) return { width: 800, height: 600 };

      const viewBox = svgElement.getAttribute('viewBox');
      if (viewBox) {
        const [, , width, height] = viewBox.split(' ').map(Number);
        return { width, height };
      }

      return {
        width: svgElement.width.baseVal.value || 800,
        height: svgElement.height.baseVal.value || 600,
      };
    });

    // 뷰포트 설정
    const width = options?.width || svgDimensions.width;
    const height = options?.height || svgDimensions.height;

    await page.setViewport({
      width: Math.ceil(width),
      height: Math.ceil(height),
    });

    // 스크린샷 촬영
    const screenshot = await page.screenshot({
      type: format === ImageFormat.PNG ? 'png' : 'jpeg',
      omitBackground: format === ImageFormat.PNG, // PNG는 투명 배경 지원
    });

    await page.close();

    return screenshot as Buffer;
  }
}

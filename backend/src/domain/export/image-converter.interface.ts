/**
 * Image Converter 인터페이스
 *
 * SVG를 PNG 등 다른 포맷으로 변환하는 외부 서비스
 * Infrastructure Layer에서 Puppeteer 또는 Sharp 라이브러리로 구현
 */
export interface IImageConverter {
  /**
   * SVG를 PNG로 변환
   *
   * @param svg - SVG 문자열
   * @param options - 변환 옵션
   * @returns PNG 이미지 데이터 (Buffer)
   */
  convertToPng(
    svg: string,
    options?: {
      width?: number;
      height?: number;
      scale?: number;
      backgroundColor?: string;
    },
  ): Promise<Buffer>;

  /**
   * SVG를 정리하여 반환 (크기 조정 없이 원본 반환)
   *
   * @param svg - SVG 문자열
   * @returns 정리된 SVG 문자열
   */
  cleanSvg(svg: string): Promise<string>;
}

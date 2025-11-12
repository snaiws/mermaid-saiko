import type { MermaidConfig } from 'mermaid';

/**
 * Mermaid 버전
 * 프론트엔드와 백엔드에서 동일한 버전 사용
 */
export const MERMAID_VERSION = '11.12.1';

/**
 * Mermaid 공통 설정
 * 프론트엔드(브라우저)와 백엔드(Puppeteer) 모두에서 사용
 */
export const MERMAID_CONFIG: MermaidConfig = {
  startOnLoad: false,
  theme: 'default',
  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  themeVariables: {
    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    // 여기에 추가 테마 변수 설정 가능
    // primaryColor: '#BB2528',
    // primaryTextColor: '#fff',
    // primaryBorderColor: '#7C0000',
  },
  // 프론트엔드 전용 설정
  securityLevel: 'loose',
};

/**
 * 백엔드 Puppeteer용 추가 CSS
 * SVG 노드의 모서리를 둥글게 만들기
 */
export const MERMAID_CUSTOM_CSS = `
  /* 플로우차트 노드 둥글게 */
  .node rect {
    rx: 10px !important;
    ry: 10px !important;
  }

  /* 클래스 다이어그램 노드 둥글게 */
  .classGroup rect {
    rx: 8px !important;
    ry: 8px !important;
  }

  /* 시퀀스 다이어그램 액터 박스 둥글게 */
  .actor {
    rx: 5px !important;
    ry: 5px !important;
  }

  /* 상태 다이어그램 둥글게 */
  .statediagram-state rect {
    rx: 8px !important;
    ry: 8px !important;
  }
`;

/**
 * Pretendard 폰트 CSS
 */
export const PRETENDARD_FONT_CSS = `
  @font-face {
    font-family: 'Pretendard';
    font-weight: 400;
    font-style: normal;
    font-display: swap;
    src: url('http://localhost:3000/fonts/Pretendard-Regular.woff2') format('woff2');
  }

  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
`;

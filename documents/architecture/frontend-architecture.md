# 프론트엔드 아키텍처

> 📋 **문서 목적**: Mermaid Saiko 프로젝트의 프론트엔드 아키텍처 설계

**마지막 업데이트**: 2025-10-26

---

## 기술 스택

- **프레임워크**: React 18.3
- **빌드 도구**: Vite 5.x
- **언어**: TypeScript 5.3
- **상태 관리**: Zustand 5.x
- **코드 에디터**: Monaco Editor 4.x
- **HTTP 클라이언트**: Axios 1.x
- **스타일링**: Tailwind CSS 3.x
- **라우팅**: React Router 7.x

---

## 프로젝트 구조

```
frontend/
├── public/                     # 정적 파일
│   └── favicon.ico
├── src/
│   ├── main.tsx               # 엔트리 포인트
│   ├── App.tsx                # 루트 컴포넌트
│   ├── pages/                 # 페이지 컴포넌트
│   │   ├── EditorPage.tsx     # 웹 에디터 페이지
│   │   └── NotFoundPage.tsx   # 404 페이지
│   ├── features/              # Feature 기반 컴포넌트
│   │   ├── editor/            # 에디터 기능
│   │   │   ├── components/
│   │   │   │   ├── CodeEditor.tsx        # Monaco Editor 래퍼
│   │   │   │   ├── EditorToolbar.tsx     # 도구 모음
│   │   │   │   └── EditorStatusBar.tsx   # 상태 표시줄
│   │   │   ├── hooks/
│   │   │   │   ├── useEditorSession.ts   # 세션 관리 훅
│   │   │   │   └── useDebounce.ts        # 디바운싱 훅
│   │   │   └── stores/
│   │   │       └── editorStore.ts        # Zustand 스토어
│   │   ├── rendering/         # 렌더링 기능
│   │   │   ├── components/
│   │   │   │   ├── DiagramPreview.tsx    # SVG 프리뷰
│   │   │   │   ├── RenderingError.tsx    # 에러 표시
│   │   │   │   └── RenderingLoading.tsx  # 로딩 표시
│   │   │   ├── hooks/
│   │   │   │   └── useRenderDiagram.ts   # 렌더링 API 호출
│   │   │   └── stores/
│   │   │       └── renderingStore.ts     # 렌더링 상태
│   │   └── export/            # Export 기능
│   │       ├── components/
│   │       │   ├── ExportButton.tsx      # Export 버튼
│   │       │   ├── ExportModal.tsx       # Export 옵션 모달
│   │       │   └── ExportProgress.tsx    # Export 진행 표시
│   │       ├── hooks/
│   │       │   └── useExportImage.ts     # Export API 호출
│   │       └── stores/
│   │           └── exportStore.ts        # Export 상태
│   ├── shared/                # 공통 컴포넌트 및 유틸
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── hooks/
│   │   │   └── useApi.ts      # API 공통 훅
│   │   └── utils/
│   │       ├── api.ts         # Axios 인스턴스 설정
│   │       └── validators.ts  # 클라이언트 사이드 검증
│   ├── types/                 # TypeScript 타입 정의
│   │   ├── api.ts             # API 응답 타입
│   │   ├── diagram.ts         # Diagram 관련 타입
│   │   └── editor.ts          # Editor 관련 타입
│   └── styles/
│       └── global.css         # 전역 스타일 (Tailwind)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 페이지 구조 및 라우팅

### 라우팅 설정

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 페이지 목록

| 경로 | 페이지 컴포넌트 | 설명 |
|------|----------------|------|
| `/` | EditorPage | 웹 에디터 메인 페이지 (코드 입력 + 프리뷰) |
| `*` | NotFoundPage | 404 페이지 |

**참고**: Phase 1+2는 단일 페이지 애플리케이션 (SPA)

---

## 컴포넌트 계층 구조

### Feature 기반 구조

각 Bounded Context별로 feature 폴더를 구성:

- **editor**: 코드 에디터 관련 기능
- **rendering**: 다이어그램 렌더링 및 프리뷰
- **export**: 이미지 export 기능

### EditorPage 컴포넌트 계층

```
EditorPage
├── EditorToolbar                 # 상단 도구 모음
│   ├── Button (공통)             # 새 다이어그램, 예제 로드 등
│   └── ExportButton              # Export 기능
│       └── ExportModal           # Export 옵션 모달
├── CodeEditor                    # Monaco Editor 래퍼
│   └── (Monaco Editor 컴포넌트)
├── DiagramPreview                # SVG 프리뷰
│   ├── RenderingLoading          # 렌더링 중 표시
│   └── RenderingError            # 렌더링 실패 표시
└── EditorStatusBar               # 하단 상태 표시줄
```

---

## 상태 관리 전략

### Zustand 기반 스토어 분리

각 Feature별로 독립적인 Zustand 스토어 사용:

#### 1. editorStore (에디터 상태)

```typescript
// features/editor/stores/editorStore.ts
import { create } from 'zustand';

interface EditorState {
  sessionId: string | null;
  mermaidCode: string;
  isDirty: boolean;

  // Actions
  setMermaidCode: (code: string) => void;
  resetEditor: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  sessionId: null,
  mermaidCode: '',
  isDirty: false,

  setMermaidCode: (code) => set({ mermaidCode: code, isDirty: true }),
  resetEditor: () => set({ sessionId: null, mermaidCode: '', isDirty: false }),
}));
```

**책임**: 에디터 세션, 코드 내용, 변경 여부 추적

---

#### 2. renderingStore (렌더링 상태)

```typescript
// features/rendering/stores/renderingStore.ts
import { create } from 'zustand';

interface RenderingState {
  diagramId: string | null;
  renderedSvg: string | null;
  isRendering: boolean;
  error: string | null;

  // Actions
  setRendering: (isRendering: boolean) => void;
  setRenderedSvg: (diagramId: string, svg: string) => void;
  setError: (error: string | null) => void;
  clearDiagram: () => void;
}

export const useRenderingStore = create<RenderingState>((set) => ({
  diagramId: null,
  renderedSvg: null,
  isRendering: false,
  error: null,

  setRendering: (isRendering) => set({ isRendering }),
  setRenderedSvg: (diagramId, svg) => set({ diagramId, renderedSvg: svg, error: null }),
  setError: (error) => set({ error, isRendering: false }),
  clearDiagram: () => set({ diagramId: null, renderedSvg: null, error: null }),
}));
```

**책임**: 렌더링 상태, SVG 결과, 에러 관리

---

#### 3. exportStore (Export 상태)

```typescript
// features/export/stores/exportStore.ts
import { create } from 'zustand';

interface ExportState {
  isExporting: boolean;
  exportFormat: 'png' | 'svg';
  exportOptions: {
    width?: number;
    height?: number;
    backgroundColor?: string;
  };

  // Actions
  setExporting: (isExporting: boolean) => void;
  setExportFormat: (format: 'png' | 'svg') => void;
  setExportOptions: (options: ExportState['exportOptions']) => void;
}

export const useExportStore = create<ExportState>((set) => ({
  isExporting: false,
  exportFormat: 'png',
  exportOptions: {},

  setExporting: (isExporting) => set({ isExporting }),
  setExportFormat: (exportFormat) => set({ exportFormat }),
  setExportOptions: (exportOptions) => set({ exportOptions }),
}));
```

**책임**: Export 진행 상태, 포맷, 옵션 관리

---

### 스토어 간 통신

스토어 간 직접 의존은 피하고, **컴포넌트에서 조율**:

```typescript
// EditorPage.tsx
function EditorPage() {
  const { mermaidCode } = useEditorStore();
  const { setRendering, setRenderedSvg, setError } = useRenderingStore();
  const { renderDiagram } = useRenderDiagram(); // API 훅

  // 디바운싱된 렌더링
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (mermaidCode.trim()) {
        setRendering(true);
        try {
          const result = await renderDiagram(mermaidCode);
          setRenderedSvg(result.data.diagramId, result.data.renderedSvg);
        } catch (error) {
          setError(error.message);
        }
      }
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timer);
  }, [mermaidCode]);

  // ...
}
```

---

## API 연동

### Axios 인스턴스 설정

```typescript
// shared/utils/api.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor (에러 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // HTTP Layer 에러 처리
    if (error.response) {
      // 서버 응답 있음
      return Promise.reject({
        message: error.response.data.error?.message || '서버 오류가 발생했습니다.',
        code: error.response.data.error?.code,
      });
    } else if (error.request) {
      // 요청 전송됐으나 응답 없음
      return Promise.reject({
        message: '서버와 연결할 수 없습니다.',
      });
    } else {
      // 요청 설정 중 에러
      return Promise.reject({
        message: '요청 중 오류가 발생했습니다.',
      });
    }
  }
);
```

---

### API 훅 (Custom Hooks)

#### 렌더링 API 훅

```typescript
// features/rendering/hooks/useRenderDiagram.ts
import { apiClient } from '@/shared/utils/api';

interface RenderRequest {
  mermaidCode: string;
}

interface RenderResponse {
  success: boolean;
  data: {
    diagramId: string;
    renderedSvg: string;
    diagramType: string;
  };
}

export function useRenderDiagram() {
  const renderDiagram = async (mermaidCode: string): Promise<RenderResponse> => {
    const response = await apiClient.post<RenderResponse>('/rendering/render', {
      mermaidCode,
    });
    return response.data;
  };

  return { renderDiagram };
}
```

---

#### Export API 훅

```typescript
// features/export/hooks/useExportImage.ts
import { apiClient } from '@/shared/utils/api';

interface ExportPngRequest {
  mermaidCode: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
}

export function useExportImage() {
  const exportPng = async (request: ExportPngRequest): Promise<Blob> => {
    const response = await apiClient.post('/export/png', request, {
      responseType: 'blob', // 바이너리 데이터 수신
    });
    return response.data;
  };

  const exportSvg = async (mermaidCode: string): Promise<Blob> => {
    const response = await apiClient.post('/export/svg',
      { mermaidCode },
      { responseType: 'blob' }
    );
    return response.data;
  };

  return { exportPng, exportSvg };
}
```

---

## Monaco Editor 통합

### CodeEditor 컴포넌트

```typescript
// features/editor/components/CodeEditor.tsx
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../stores/editorStore';

export function CodeEditor() {
  const { mermaidCode, setMermaidCode } = useEditorStore();

  return (
    <Editor
      height="100%"
      defaultLanguage="mermaid"
      value={mermaidCode}
      onChange={(value) => setMermaidCode(value || '')}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
      }}
    />
  );
}
```

### 디바운싱 훅

```typescript
// features/editor/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 스타일링 전략

### Tailwind CSS 설정

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        error: '#ef4444',
        success: '#10b981',
      },
    },
  },
  plugins: [],
};
```

### 컴포넌트 스타일링 예시

```typescript
// shared/components/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
}
```

---

## 타입 정의

### API 응답 타입

```typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface DiagramDto {
  diagramId: string;
  mermaidCode: string;
  renderedSvg: string;
  diagramType: string;
}

export interface ValidationErrorDto {
  line?: number;
  message: string;
}
```

### Domain 타입

```typescript
// types/diagram.ts
export type DiagramType = 'flowchart' | 'sequence' | 'class' | 'state' | 'er' | 'gantt' | 'pie' | 'unknown';

export interface Diagram {
  id: string;
  mermaidCode: string;
  renderedSvg: string | null;
  diagramType: DiagramType;
  renderStatus: 'pending' | 'success' | 'failed';
  errorMessage: string | null;
}
```

---

## 환경 변수

### .env 파일

```env
# 개발 환경
VITE_API_BASE_URL=http://localhost:3000/api/v1

# 프로덕션 환경
# VITE_API_BASE_URL=https://api.mermaid-saiko.com/api/v1
```

### 사용 예시

```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 빌드 및 배포

### 개발 모드

```bash
npm run dev
```

- Vite Dev Server 실행 (포트 5173)
- Hot Module Replacement (HMR) 활성화
- 백엔드와 분리된 독립 서버

---

### 프로덕션 빌드

```bash
npm run build
```

- `dist/` 폴더에 정적 파일 생성
- TypeScript 컴파일
- 코드 최적화 및 번들링

---

### NestJS와 통합 배포

프로덕션 환경에서는 NestJS가 프론트엔드 정적 파일 서빙:

```typescript
// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 프론트엔드 정적 파일 서빙
  app.useStaticAssets(join(__dirname, '..', '..', 'frontend', 'dist'));

  // SPA 라우팅 지원
  app.setBaseViewsDir(join(__dirname, '..', '..', 'frontend', 'dist'));
  app.setViewEngine('html');

  await app.listen(3000);
}
bootstrap();
```

---

## 핵심 결정 사항

### 1. Feature 기반 구조 vs Atomic Design
**결정**: Feature 기반 구조

**이유**:
- Bounded Context와 일치 (DDD)
- 코드 응집도 높음 (관련 코드가 한 곳에)
- 확장 시 Context 단위로 분리 용이

---

### 2. 상태 관리 라이브러리
**결정**: Zustand

**이유**:
- 간단한 API (Redux보다 훨씬 간결)
- 보일러플레이트 최소화
- TypeScript 지원 우수
- 프로젝트 규모에 적합

---

### 3. 개발/프로덕션 서버 분리
**결정**: 개발 시 분리, 프로덕션에서 통합

**이유**:
- 개발: Vite Dev Server (HMR, 빠른 개발)
- 프로덕션: NestJS 정적 서빙 (단일 배포)

---

### 4. 코드 에디터
**결정**: Monaco Editor

**이유**:
- VS Code와 동일 엔진 (익숙함)
- Syntax Highlighting 우수
- TypeScript 타입 정의 완벽
- 번들 크기는 크지만 기능 대비 합리적

---

## 승인 상태

**전체 승인 상태**: ✅ (승인 완료 - 2025-10-26)

**승인 체크리스트**:
- [x] 프로젝트 구조 승인
- [x] Feature 기반 구조 승인
- [x] Zustand 스토어 분리 전략 승인
- [x] API 연동 방식 승인
- [x] Monaco Editor 통합 승인
- [x] Tailwind CSS 스타일링 승인
- [x] 빌드 및 배포 전략 승인

---

> 📎 **관련 문서**:
> - `documents/architecture/system-overview.md`
> - `documents/architecture/technology-stack.md`
> - `documents/api/editor-api.md`
> - `documents/domain-modeling/editor/aggregates.md`

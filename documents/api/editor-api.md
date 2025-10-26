# Editor Context - API 명세

> 📋 **문서 목적**: Editor Context의 WebSocket/REST API 정의

**마지막 업데이트**: 2025-10-26

---

## API 개요

Editor Context는 **웹 프론트엔드 전용**이며, 대부분의 로직은 **클라이언트 사이드**에서 처리됩니다.

**인증**: 불필요 (공개 서비스)

---

## 아키텍처 결정

### Option A: 순수 클라이언트 사이드 (추천)
- 에디터 상태 관리는 프론트엔드 (React State, Zustand 등)
- 렌더링 요청만 Rendering API 호출 (`POST /api/v1/rendering/render`)
- Undo/Redo, 커서 위치, 히스토리 등은 브라우저 메모리에서 관리
- **장점**: 서버 부하 없음, 빠른 반응속도
- **단점**: 페이지 새로고침 시 히스토리 손실

### Option B: WebSocket 기반 (선택적)
- 실시간 렌더링 업데이트를 위한 WebSocket 연결
- 서버에서 세션 상태 관리
- **장점**: 서버 측 세션 관리, 향후 협업 기능 확장 용이
- **단점**: 복잡도 증가, Phase 1+2 범위 초과

---

## 결정: Option A (순수 클라이언트 사이드)

Editor Context는 **백엔드 API를 제공하지 않습니다**.

### 이유
1. **프로젝트 범위**: Phase 1+2는 협업 기능 없음
2. **단순성**: 클라이언트 사이드만으로 충분
3. **성능**: 서버 왕복 없이 즉각 반응
4. **비용**: 서버 리소스 절약

### 클라이언트 구현 지침

#### 에디터 상태 관리
```typescript
interface EditorState {
  currentCode: string;
  cursorPosition: { line: number; column: number };
  history: {
    undoStack: string[];
    redoStack: string[];
  };
  isRenderPending: boolean;
  lastRenderRequestedAt: Date | null;
}
```

#### 디바운싱 로직
```typescript
const DEBOUNCE_DELAY_MS = 300;

function onCodeChange(newCode: string) {
  // 1. 상태 업데이트
  updateCurrentCode(newCode);

  // 2. 히스토리에 저장
  pushToUndoStack(oldCode);

  // 3. 디바운싱 타이머 설정
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    requestRender(newCode);
  }, DEBOUNCE_DELAY_MS);
}
```

#### 렌더링 요청
```typescript
async function requestRender(mermaidCode: string) {
  setRenderPending(true);

  try {
    const response = await fetch('/api/v1/rendering/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mermaidCode })
    });

    const result = await response.json();

    if (result.success) {
      displayDiagram(result.data.renderedSvg);
    } else {
      displayError(result.error.message);
    }
  } catch (error) {
    displayError('렌더링 요청 실패');
  } finally {
    setRenderPending(false);
  }
}
```

#### Undo/Redo 로직
```typescript
function undo() {
  if (undoStack.length === 0) return;

  const previousCode = undoStack.pop();
  redoStack.push(currentCode);

  setCurrentCode(previousCode);
  requestRender(previousCode);
}

function redo() {
  if (redoStack.length === 0) return;

  const nextCode = redoStack.pop();
  undoStack.push(currentCode);

  setCurrentCode(nextCode);
  requestRender(nextCode);
}
```

---

## 사용하는 외부 API

Editor Context는 다음 API를 호출합니다:

### 1. Rendering API
- **Endpoint**: `POST /api/v1/rendering/render`
- **목적**: 코드 변경 시 다이어그램 렌더링
- **호출 시점**: 디바운싱 후, Undo/Redo 시
- **문서**: `documents/api/rendering-api.md`

### 2. Export API (선택적)
- **Endpoint**: `POST /api/v1/export/png` 또는 `/svg`
- **목적**: 사용자가 다운로드 버튼 클릭 시
- **호출 시점**: 다운로드 버튼 클릭
- **문서**: `documents/api/export-api.md`

---

## 프론트엔드 컴포넌트 구조 (참고)

```
EditorPage
├─ CodeEditor (Monaco Editor, CodeMirror 등)
│  ├─ onCodeChange → 디바운싱 → requestRender
│  ├─ onUndo → undo()
│  └─ onRedo → redo()
├─ DiagramPreview
│  ├─ 렌더링된 SVG 표시
│  └─ 에러 메시지 표시
└─ Toolbar
   ├─ Undo 버튼
   ├─ Redo 버튼
   └─ Download 버튼 (PNG/SVG)
```

---

## 향후 확장 가능성 (Phase 3)

만약 협업 기능이 추가되면 WebSocket API 도입 고려:

### WebSocket Events (미래 계획)
- `codeChanged`: 다른 사용자의 코드 변경 알림
- `cursorMoved`: 다른 사용자의 커서 위치 공유
- `userJoined`: 새 사용자 입장
- `userLeft`: 사용자 퇴장

**현재 Phase 1+2에서는 구현하지 않음**

---

## 승인 상태

**전체 승인 상태**: ✅ (승인 완료)

**승인 체크리스트**:
- [x] 클라이언트 사이드 구현 방식 승인
- [x] 디바운싱 로직 승인
- [x] 외부 API 호출 방식 승인

**승인 날짜**: 2025-10-26

---

> 📎 **관련 문서**:
> - `documents/domain-modeling/editor/aggregates.md`
> - `documents/requirements/editor-requirements.md`
> - `documents/api/rendering-api.md`
> - `documents/api/export-api.md`

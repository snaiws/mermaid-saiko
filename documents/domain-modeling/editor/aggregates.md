# Editor Context - Aggregates

> 📋 **문서 목적**: Editor Context의 Aggregate 설계

**마지막 업데이트**: 2025-10-26

---

## Editor Context 개요

**책임**: 웹 브라우저에서 사용자가 Mermaid 코드를 편집하고 실시간으로 확인하는 UI 로직

---

## Aggregate: EditorSession (Root)

### 책임

사용자가 웹 에디터에서 작업하는 동안의 세션 상태를 관리하고, 실시간 렌더링 요청을 조율합니다.

### 구조

```
EditorSession (Aggregate Root)
├─ id: SessionId (식별자)
├─ currentCode: string (현재 입력된 코드)
├─ cursorPosition: CursorPosition (Value Object)
│  ├─ line: number
│  └─ column: number
├─ history: CodeHistory (Value Object)
│  ├─ undoStack: string[]
│  └─ redoStack: string[]
├─ debounceTimer: number | null (디바운싱 타이머 ID)
├─ lastRenderRequestedAt: Date | null
├─ isRenderPending: boolean
└─ createdAt: Date
```

### Value Objects

#### 1. CursorPosition
- **line**: 커서 위치 (라인)
- **column**: 커서 위치 (컬럼)

**책임**:
- 커서 위치 추적
- 위치 유효성 검증 (음수 불가)

#### 2. CodeHistory
- **undoStack**: 되돌리기 스택 (최대 50개)
- **redoStack**: 다시 실행 스택 (최대 50개)

**책임**:
- 코드 변경 이력 관리
- 스택 크기 제한 (메모리 관리)

### Constants

```typescript
const DEBOUNCE_DELAY_MS = 300; // 디바운싱 지연 시간
const MAX_HISTORY_SIZE = 50;   // 최대 히스토리 크기
```

---

## 비즈니스 규칙 (Invariants)

1. **코드는 빈 문자열 가능**: 사용자가 아직 입력하지 않은 경우 허용
2. **커서 위치는 음수 불가**: `line >= 0`, `column >= 0`
3. **히스토리 스택 크기 제한**: 각 스택은 최대 50개까지만 유지
4. **디바운싱 적용**: 코드 변경 후 300ms 대기 후 렌더링 요청

---

## 주요 메서드

### `create(): EditorSession`
- 새로운 EditorSession 생성
- 빈 코드, 초기 커서 위치 (0, 0)
- 이벤트 발행: `EditorSessionStarted`

### `updateCode(newCode: string, cursorPosition: CursorPosition): void`
- 코드 업데이트
- 히스토리에 이전 코드 저장
- 디바운싱 타이머 설정
- 이벤트 발행: `CodeChanged`

### `requestRender(): void`
- Rendering Context에 렌더링 요청
- `isRenderPending = true`
- `lastRenderRequestedAt` 업데이트
- 이벤트 발행: `RenderRequested`

### `undo(): void`
- undoStack에서 이전 코드 복원
- 현재 코드를 redoStack에 저장
- 이벤트 발행: `CodeUndone`

### `redo(): void`
- redoStack에서 다음 코드 복원
- 현재 코드를 undoStack에 저장
- 이벤트 발행: `CodeRedone`

### `updateCursor(position: CursorPosition): void`
- 커서 위치 업데이트
- 이벤트 없음 (UI 상태만 변경)

### `clearHistory(): void`
- 모든 히스토리 삭제
- undoStack, redoStack 비우기

---

## 발생 이벤트

- `EditorSessionStarted`: 세션 시작 시
- `CodeChanged`: 코드 변경 시
- `RenderRequested`: 렌더링 요청 시 (디바운싱 후)
- `CodeUndone`: 되돌리기 실행 시
- `CodeRedone`: 다시 실행 시

---

## 승인 상태

**전체 승인 상태**: ✅ (승인 완료)

**승인 체크리스트**:
- [x] Aggregate 구조 승인
- [x] Value Object 정의 승인
- [x] 비즈니스 규칙 승인
- [x] 주요 메서드 승인

**승인 날짜**: 2025-10-26

---

> 📎 **관련 문서**:
> - `documents/domain-modeling/bounded-contexts.md`
> - `documents/domain-modeling/editor/events.md`
> - `documents/domain-modeling/editor/language.md`

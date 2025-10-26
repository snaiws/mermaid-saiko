# Rendering Context - Aggregates

> 📋 **문서 목적**: Rendering Context의 Aggregate 설계

**마지막 업데이트**: 2025-10-26

---

## Rendering Context 개요

**책임**: Mermaid 코드를 다이어그램으로 변환하는 핵심 도메인 로직

---

## Aggregate: Diagram (Root)

### 책임

Mermaid 코드를 파싱하고 다이어그램으로 렌더링하는 모든 로직을 담당합니다.

### 구조

```
Diagram (Aggregate Root)
├─ id: DiagramId (식별자)
├─ mermaidCode: MermaidCode (Value Object)
│  ├─ rawCode: string
│  └─ diagramType: DiagramType (enum)
├─ renderedSvg: string | null
├─ renderStatus: RenderStatus (enum)
├─ error: RenderingError | null (Value Object)
│  ├─ message: string
│  ├─ line: number | null
│  └─ column: number | null
└─ createdAt: Date
```

### Value Objects

#### 1. MermaidCode
- **rawCode**: 원본 Mermaid 코드
- **diagramType**: 다이어그램 타입 (flowchart, sequence, class, ER, gantt, etc.)

**책임**:
- 코드 유효성 검증 (빈 문자열 금지)
- 다이어그램 타입 자동 감지

#### 2. RenderingError
- **message**: 에러 메시지
- **line**: 에러 발생 라인 (optional)
- **column**: 에러 발생 컬럼 (optional)

**책임**:
- 파싱 에러 정보 캡슐화

### Enums

#### DiagramType
```typescript
enum DiagramType {
  FLOWCHART = 'flowchart',
  SEQUENCE = 'sequence',
  CLASS = 'class',
  STATE = 'state',
  ER = 'er',
  GANTT = 'gantt',
  PIE = 'pie',
  GIT = 'git',
  JOURNEY = 'journey',
  MINDMAP = 'mindmap',
  TIMELINE = 'timeline',
  UNKNOWN = 'unknown'
}
```

#### RenderStatus
```typescript
enum RenderStatus {
  PENDING = 'pending',     // 렌더링 대기
  SUCCESS = 'success',     // 렌더링 성공
  FAILED = 'failed'        // 렌더링 실패
}
```

---

## 비즈니스 규칙 (Invariants)

1. **Mermaid 코드는 비어있을 수 없음**: `rawCode`가 빈 문자열이면 생성 불가
2. **렌더링 성공 시 SVG 필수**: `renderStatus === SUCCESS`이면 `renderedSvg`는 null이 아님
3. **렌더링 실패 시 에러 필수**: `renderStatus === FAILED`이면 `error`는 null이 아님
4. **성공 시 에러 없음**: `renderStatus === SUCCESS`이면 `error`는 null

---

## 주요 메서드

### `create(mermaidCode: string): Diagram`
- 새로운 Diagram을 생성하고 즉시 렌더링 시도
- 코드 유효성 검증
- 이벤트 발행: `DiagramCreated`

### `render(): void`
- Mermaid.js를 사용하여 코드를 SVG로 변환
- 성공 시: `renderStatus = SUCCESS`, `renderedSvg` 저장
- 실패 시: `renderStatus = FAILED`, `error` 저장
- 이벤트 발행: `DiagramRendered` 또는 `DiagramRenderFailed`

### `updateCode(newCode: string): void`
- Mermaid 코드 업데이트
- 자동으로 재렌더링 수행
- 이벤트 발행: `DiagramCodeUpdated`

### `getSvg(): string`
- 렌더링된 SVG 반환
- `renderStatus !== SUCCESS`이면 예외 발생

### `getError(): RenderingError`
- 렌더링 에러 반환
- `renderStatus !== FAILED`이면 예외 발생

---

## 발생 이벤트

- `DiagramCreated`: Diagram 생성 시
- `DiagramRendered`: 렌더링 성공 시
- `DiagramRenderFailed`: 렌더링 실패 시
- `DiagramCodeUpdated`: 코드 업데이트 시

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
> - `documents/domain-modeling/rendering/events.md`
> - `documents/domain-modeling/rendering/language.md`

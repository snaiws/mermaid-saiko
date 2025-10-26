# Editor Context - Domain Events

> 📋 **문서 목적**: Editor Context에서 발생하는 Domain Event 정의

**마지막 업데이트**: 2025-10-26

---

## Editor Context 개요

**책임**: 웹 브라우저에서 사용자가 Mermaid 코드를 편집하고 실시간으로 확인하는 UI 로직

---

## Event 1: EditorSessionStarted

### 발생 시점
사용자가 웹 에디터를 열고 EditorSession이 생성될 때

### 발행자
`EditorSession` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // SessionId
  occurredAt: Date;
}
```

### 구독자
- 없음 (현재 단계에서는 로깅 목적만)

### 비즈니스 의미
새로운 에디터 세션이 시작되었음을 알립니다.

---

## Event 2: CodeChanged

### 발생 시점
사용자가 에디터에서 코드를 입력하거나 수정할 때

### 발행자
`EditorSession` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // SessionId
  occurredAt: Date;
  newCode: string;
  cursorLine: number;
  cursorColumn: number;
}
```

### 구독자
- **EditorSession 자신**: 디바운싱 타이머 설정
- **Rendering Context** (간접): 디바운싱 후 `RenderRequested` 이벤트 발행

### 비즈니스 의미
코드가 변경되었으며, 곧 렌더링 요청이 발생할 예정임을 알립니다.

---

## Event 3: RenderRequested

### 발생 시점
디바운싱 타이머가 완료되고 실제 렌더링 요청이 발생할 때

### 발행자
`EditorSession` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // SessionId
  occurredAt: Date;
  mermaidCode: string;
}
```

### 구독자
- **Rendering Context**: 코드를 받아 다이어그램 렌더링 수행

### 비즈니스 의미
디바운싱이 완료되어 실제 렌더링 작업을 시작해야 함을 알립니다.

---

## Event 4: CodeUndone

### 발생 시점
사용자가 되돌리기(Undo) 기능을 실행할 때

### 발행자
`EditorSession` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // SessionId
  occurredAt: Date;
  restoredCode: string;
}
```

### 구독자
- **Rendering Context**: 복원된 코드로 재렌더링

### 비즈니스 의미
코드가 이전 상태로 복원되었으며, 다이어그램도 업데이트되어야 함을 알립니다.

---

## Event 5: CodeRedone

### 발생 시점
사용자가 다시 실행(Redo) 기능을 실행할 때

### 발행자
`EditorSession` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // SessionId
  occurredAt: Date;
  restoredCode: string;
}
```

### 구독자
- **Rendering Context**: 복원된 코드로 재렌더링

### 비즈니스 의미
코드가 다음 상태로 복원되었으며, 다이어그램도 업데이트되어야 함을 알립니다.

---

## 승인 상태

**전체 승인 상태**: ✅ (승인 완료)

**승인 체크리스트**:
- [x] 모든 Event 정의 승인
- [x] Event 페이로드 구조 승인
- [x] 구독자 관계 승인

**승인 날짜**: 2025-10-26

---

> 📎 **관련 문서**:
> - `documents/domain-modeling/bounded-contexts.md`
> - `documents/domain-modeling/editor/aggregates.md`
> - `documents/domain-modeling/editor/language.md`

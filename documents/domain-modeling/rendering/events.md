# Rendering Context - Domain Events

> 📋 **문서 목적**: Rendering Context에서 발생하는 Domain Event 정의

**마지막 업데이트**: 2025-10-26

---

## Rendering Context 개요

**책임**: Mermaid 코드를 다이어그램으로 변환하는 핵심 도메인 로직

---

## Event 1: DiagramCreated

### 발생 시점
Diagram Aggregate가 생성되고 초기 렌더링이 시작될 때

### 발행자
`Diagram` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // DiagramId
  occurredAt: Date;
  mermaidCode: string;
  diagramType: DiagramType;
}
```

### 구독자
- 없음 (현재 단계에서는 로깅 목적만)

### 비즈니스 의미
새로운 다이어그램 렌더링 작업이 시작되었음을 알립니다.

---

## Event 2: DiagramRendered

### 발생 시점
Mermaid 코드가 성공적으로 SVG로 렌더링된 후

### 발행자
`Diagram` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // DiagramId
  occurredAt: Date;
  renderedSvg: string;
  diagramType: DiagramType;
}
```

### 구독자
- **Export Context**: 렌더링된 SVG를 받아 이미지 export 준비
- **Editor Context**: 렌더링 완료 상태 업데이트

### 비즈니스 의미
다이어그램 렌더링이 성공했으며, Export나 표시가 가능한 상태가 되었음을 알립니다.

---

## Event 3: DiagramRenderFailed

### 발생 시점
Mermaid 코드 파싱 또는 렌더링이 실패한 후

### 발행자
`Diagram` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // DiagramId
  occurredAt: Date;
  errorMessage: string;
  errorLine: number | null;
  errorColumn: number | null;
  mermaidCode: string;
}
```

### 구독자
- **Editor Context**: 에러 메시지를 사용자에게 표시

### 비즈니스 의미
다이어그램 렌더링이 실패했으며, 사용자에게 에러를 알려야 함을 나타냅니다.

---

## Event 4: DiagramCodeUpdated

### 발생 시점
기존 Diagram의 Mermaid 코드가 업데이트되고 재렌더링이 시작될 때

### 발행자
`Diagram` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // DiagramId
  occurredAt: Date;
  oldCode: string;
  newCode: string;
  diagramType: DiagramType;
}
```

### 구독자
- 없음 (현재 단계에서는 로깅 목적만)

### 비즈니스 의미
다이어그램 코드가 업데이트되어 재렌더링 작업이 시작되었음을 알립니다.

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
> - `documents/domain-modeling/rendering/aggregates.md`
> - `documents/domain-modeling/rendering/language.md`

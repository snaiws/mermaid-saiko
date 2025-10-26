# Export Context - Domain Events

> 📋 **문서 목적**: Export Context에서 발생하는 Domain Event 정의

**마지막 업데이트**: 2025-10-26

---

## Export Context 개요

**책임**: 렌더링된 다이어그램을 다양한 포맷의 이미지 파일로 변환

---

## Event 1: ImageExportRequested

### 발생 시점
DiagramImage Aggregate가 생성되고 export 작업이 시작될 때

### 발행자
`DiagramImage` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // ImageId
  occurredAt: Date;
  format: ImageFormat; // 'png' | 'svg'
  fileName: string | null;
  width: number | null;
  height: number | null;
}
```

### 구독자
- 없음 (현재 단계에서는 로깅 목적만)

### 비즈니스 의미
새로운 이미지 export 작업이 시작되었음을 알립니다.

---

## Event 2: ImageExported

### 발생 시점
SVG가 성공적으로 이미지로 변환된 후

### 발행자
`DiagramImage` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // ImageId
  occurredAt: Date;
  format: ImageFormat;
  fileName: string;
  fileSize: number; // bytes
}
```

### 구독자
- **API Layer**: 클라이언트에게 이미지 데이터 반환
- **Editor Context** (웹): 다운로드 링크 생성

### 비즈니스 의미
이미지 export가 성공했으며, 다운로드 또는 전송이 가능한 상태가 되었음을 알립니다.

---

## Event 3: ImageExportFailed

### 발생 시점
SVG → 이미지 변환이 실패한 후

### 발행자
`DiagramImage` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // ImageId
  occurredAt: Date;
  format: ImageFormat;
  errorMessage: string;
}
```

### 구독자
- **API Layer**: 클라이언트에게 에러 응답 반환
- **Editor Context** (웹): 사용자에게 에러 메시지 표시

### 비즈니스 의미
이미지 export가 실패했으며, 사용자에게 에러를 알려야 함을 나타냅니다.

---

## Event 4: ImageResized

### 발생 시점
PNG 이미지 크기가 재조정된 후 (SVG는 해당 없음)

### 발행자
`DiagramImage` Aggregate

### 페이로드
```typescript
{
  eventId: string;
  aggregateId: string; // ImageId
  occurredAt: Date;
  oldWidth: number | null;
  oldHeight: number | null;
  newWidth: number;
  newHeight: number;
}
```

### 구독자
- 없음 (현재 단계에서는 로깅 목적만)

### 비즈니스 의미
이미지 크기가 재조정되어 재변환이 완료되었음을 알립니다.

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
> - `documents/domain-modeling/export/aggregates.md`
> - `documents/domain-modeling/export/language.md`

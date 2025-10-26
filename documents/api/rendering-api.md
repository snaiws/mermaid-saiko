# Rendering Context - API 명세

> 📋 **문서 목적**: Rendering Context의 REST API 엔드포인트 정의

**마지막 업데이트**: 2025-10-26

---

## API 개요

**Base URL**: `/api/v1/rendering`

**인증**: 불필요 (공개 API)

---

## 엔드포인트 목록

| 기능 ID | Method | Endpoint | Request | Response | 권한 | 비고 |
|---------|--------|----------|---------|----------|------|------|
| RENDER-01 | POST | /render | mermaidCode | diagramId, renderedSvg | - | 다이어그램 변환 |
| RENDER-02 | GET | /diagram/{diagramId} | - | diagramId, renderedSvg, status | - | 다이어그램 조회 |
| RENDER-03 | POST | /validate | mermaidCode | valid, error? | - | 코드 유효성 검증 |

---

## API 상세

### 1. POST /api/v1/rendering/render

**설명**: Mermaid 코드를 다이어그램으로 렌더링합니다.

**Request Body**:
```json
{
  "mermaidCode": "graph LR\n    A[시작] --> B[처리]\n    B --> C[종료]"
}
```

**Request 필드**:
- `mermaidCode` (string, required): Mermaid 문법 코드

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "diagramId": "550e8400-e29b-41d4-a716-446655440000",
    "renderedSvg": "<svg>...</svg>",
    "diagramType": "flowchart",
    "createdAt": "2025-10-26T10:00:00Z"
  }
}
```

**Response 필드**:
- `diagramId` (string): 생성된 다이어그램 ID
- `renderedSvg` (string): 렌더링된 SVG 문자열
- `diagramType` (string): 다이어그램 타입
- `createdAt` (string): 생성 일시 (ISO 8601)

**Error Responses**:

**400 Bad Request** (잘못된 요청):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "mermaidCode는 필수입니다"
  }
}
```

**422 Unprocessable Entity** (렌더링 실패):
```json
{
  "success": false,
  "error": {
    "code": "RENDER_FAILED",
    "message": "Syntax error in graph",
    "details": {
      "line": 2,
      "column": 10,
      "mermaidCode": "graph LR\n    A[시작] --> B[처리"
    }
  }
}
```

---

### 2. GET /api/v1/rendering/diagram/{diagramId}

**설명**: 이전에 렌더링된 다이어그램을 조회합니다.

**Path Parameters**:
- `diagramId` (string, required): 다이어그램 ID

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "diagramId": "550e8400-e29b-41d4-a716-446655440000",
    "renderedSvg": "<svg>...</svg>",
    "diagramType": "flowchart",
    "mermaidCode": "graph LR\n    A[시작] --> B[처리]\n    B --> C[종료]",
    "status": "success",
    "createdAt": "2025-10-26T10:00:00Z"
  }
}
```

**Response 필드**:
- `diagramId` (string): 다이어그램 ID
- `renderedSvg` (string): 렌더링된 SVG
- `diagramType` (string): 다이어그램 타입
- `mermaidCode` (string): 원본 Mermaid 코드
- `status` (string): 렌더링 상태 (success/failed)
- `createdAt` (string): 생성 일시

**Error Responses**:

**404 Not Found** (다이어그램 없음):
```json
{
  "success": false,
  "error": {
    "code": "DIAGRAM_NOT_FOUND",
    "message": "다이어그램을 찾을 수 없습니다"
  }
}
```

---

### 3. POST /api/v1/rendering/validate

**설명**: Mermaid 코드의 유효성을 검증합니다 (렌더링하지 않음).

**Request Body**:
```json
{
  "mermaidCode": "graph LR\n    A[시작] --> B[처리]"
}
```

**Request 필드**:
- `mermaidCode` (string, required): 검증할 Mermaid 코드

**Response (200 OK)** - 유효한 코드:
```json
{
  "success": true,
  "data": {
    "valid": true,
    "diagramType": "flowchart"
  }
}
```

**Response (200 OK)** - 유효하지 않은 코드:
```json
{
  "success": true,
  "data": {
    "valid": false,
    "error": {
      "message": "Syntax error in graph",
      "line": 2,
      "column": 10
    }
  }
}
```

**Response 필드**:
- `valid` (boolean): 코드 유효성 여부
- `diagramType` (string, optional): 다이어그램 타입 (유효한 경우)
- `error` (object, optional): 에러 정보 (유효하지 않은 경우)

---

## 공통 응답 구조

### 성공 응답
```json
{
  "success": true,
  "data": { ... }
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": { ... }
  }
}
```

---

## 에러 코드

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| INVALID_REQUEST | 400 | 잘못된 요청 (필수 필드 누락 등) |
| RENDER_FAILED | 422 | 렌더링 실패 (파싱 에러 등) |
| DIAGRAM_NOT_FOUND | 404 | 다이어그램을 찾을 수 없음 |
| INTERNAL_ERROR | 500 | 서버 내부 오류 |

---

## 승인 상태

**전체 승인 상태**: ✅ (승인 완료)

**승인 체크리스트**:
- [x] 모든 엔드포인트 정의 승인
- [x] Request/Response 구조 승인
- [x] 에러 코드 정의 승인

**승인 날짜**: 2025-10-26

---

> 📎 **관련 문서**:
> - `documents/domain-modeling/rendering/aggregates.md`
> - `documents/requirements/render-requirements.md`
> - `documents/api/export-api.md`

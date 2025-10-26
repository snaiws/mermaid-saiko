# Export Context - API 명세

> 📋 **문서 목적**: Export Context의 REST API 엔드포인트 정의

**마지막 업데이트**: 2025-10-26

---

## API 개요

**Base URL**: `/api/v1/export`

**인증**: 불필요 (공개 API)

---

## 엔드포인트 목록

| 기능 ID | Method | Endpoint | Request | Response | 권한 | 비고 |
|---------|--------|----------|---------|----------|------|------|
| EXPORT-01 | POST | /png | mermaidCode, options | image (binary) | - | PNG 이미지 생성 |
| EXPORT-02 | POST | /svg | mermaidCode, options | svg (text) | - | SVG 이미지 생성 |
| EXPORT-03 | POST | /render-and-export | mermaidCode, format, options | image | - | 렌더링 + Export 한번에 |

---

## API 상세

### 1. POST /api/v1/export/png

**설명**: Mermaid 코드를 PNG 이미지로 변환하여 반환합니다.

**Request Body**:
```json
{
  "mermaidCode": "graph LR\n    A[시작] --> B[처리]\n    B --> C[종료]",
  "options": {
    "fileName": "my-diagram",
    "width": 800,
    "height": 600,
    "scale": 2
  }
}
```

**Request 필드**:
- `mermaidCode` (string, required): Mermaid 문법 코드
- `options` (object, optional): Export 옵션
  - `fileName` (string, optional): 파일명 (확장자 제외, 기본값: `diagram-{timestamp}`)
  - `width` (number, optional): 이미지 너비 (px, 기본값: 원본 크기)
  - `height` (number, optional): 이미지 높이 (px, 기본값: 원본 크기)
  - `scale` (number, optional): 배율 (기본값: 1)

**Response (200 OK)**:
- **Content-Type**: `image/png`
- **Content-Disposition**: `attachment; filename="my-diagram.png"`
- **Body**: PNG 이미지 바이너리 데이터

**Response Headers**:
- `X-Image-Width`: 이미지 너비 (px)
- `X-Image-Height`: 이미지 높이 (px)
- `X-File-Size`: 파일 크기 (bytes)

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
    "message": "Mermaid 코드 파싱 실패",
    "details": {
      "line": 2,
      "column": 10
    }
  }
}
```

**500 Internal Server Error** (Export 실패):
```json
{
  "success": false,
  "error": {
    "code": "EXPORT_FAILED",
    "message": "PNG 변환 중 오류 발생"
  }
}
```

---

### 2. POST /api/v1/export/svg

**설명**: Mermaid 코드를 SVG 이미지로 변환하여 반환합니다.

**Request Body**:
```json
{
  "mermaidCode": "graph LR\n    A[시작] --> B[처리]\n    B --> C[종료]",
  "options": {
    "fileName": "my-diagram"
  }
}
```

**Request 필드**:
- `mermaidCode` (string, required): Mermaid 문법 코드
- `options` (object, optional): Export 옵션
  - `fileName` (string, optional): 파일명 (확장자 제외, 기본값: `diagram-{timestamp}`)
  - ⚠️ **주의**: SVG는 width/height/scale 옵션 무시 (벡터 이미지)

**Response (200 OK)**:
- **Content-Type**: `image/svg+xml`
- **Content-Disposition**: `attachment; filename="my-diagram.svg"`
- **Body**: SVG XML 텍스트

**Response Headers**:
- `X-File-Size`: 파일 크기 (bytes)

**Error Responses**:
- 400, 422, 500 에러는 PNG API와 동일

---

### 3. POST /api/v1/export/render-and-export

**설명**: 렌더링과 Export를 한 번의 요청으로 처리합니다 (MCP용).

**Request Body**:
```json
{
  "mermaidCode": "graph LR\n    A[시작] --> B[처리]\n    B --> C[종료]",
  "format": "png",
  "options": {
    "fileName": "diagram",
    "width": 800,
    "height": 600
  }
}
```

**Request 필드**:
- `mermaidCode` (string, required): Mermaid 문법 코드
- `format` (string, required): 이미지 포맷 (`png` | `svg`)
- `options` (object, optional): Export 옵션 (PNG/SVG API와 동일)

**Response (200 OK)**:
- **PNG**: `Content-Type: image/png`, 바이너리 데이터
- **SVG**: `Content-Type: image/svg+xml`, SVG 텍스트

**Error Responses**:
- 400, 422, 500 에러는 PNG/SVG API와 동일

---

## 공통 응답 구조

### 성공 응답 (이미지)
- 바이너리 또는 텍스트 데이터 직접 반환
- Content-Type 및 Content-Disposition 헤더 설정

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
| INVALID_REQUEST | 400 | 잘못된 요청 (필수 필드 누락, 유효하지 않은 옵션 값) |
| RENDER_FAILED | 422 | Mermaid 코드 렌더링 실패 |
| EXPORT_FAILED | 500 | 이미지 변환 실패 |
| INTERNAL_ERROR | 500 | 서버 내부 오류 |

---

## Export 옵션 유효성 규칙

| 옵션 | 제약 조건 | 기본값 |
|------|-----------|--------|
| fileName | 특수문자 제한 (`/`, `\`, `:` 불가) | `diagram-{timestamp}` |
| width | 양수, PNG만 적용 | 원본 크기 |
| height | 양수, PNG만 적용 | 원본 크기 |
| scale | 0보다 큰 수, PNG만 적용 | 1 |

---

## 승인 상태

**전체 승인 상태**: ✅ (승인 완료)

**승인 체크리스트**:
- [x] 모든 엔드포인트 정의 승인
- [x] Request/Response 구조 승인
- [x] 에러 코드 정의 승인
- [x] Export 옵션 규칙 승인

**승인 날짜**: 2025-10-26

---

> 📎 **관련 문서**:
> - `documents/domain-modeling/export/aggregates.md`
> - `documents/requirements/export-requirements.md`
> - `documents/api/rendering-api.md`

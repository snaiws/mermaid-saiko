# Export Context - Aggregates

> 📋 **문서 목적**: Export Context의 Aggregate 설계

**마지막 업데이트**: 2025-10-26

---

## Export Context 개요

**책임**: 렌더링된 다이어그램을 다양한 포맷의 이미지 파일로 변환

---

## Aggregate: DiagramImage (Root)

### 책임

렌더링된 SVG를 PNG, SVG 등 다양한 포맷의 이미지로 변환하고 export 옵션을 관리합니다.

### 구조

```
DiagramImage (Aggregate Root)
├─ id: ImageId (식별자)
├─ sourceSvg: string (렌더링된 SVG)
├─ format: ImageFormat (enum)
├─ imageData: Buffer | string
├─ options: ExportOptions (Value Object)
│  ├─ fileName: string | null
│  ├─ width: number | null
│  ├─ height: number | null
│  └─ scale: number (default: 1)
├─ exportStatus: ExportStatus (enum)
├─ error: ExportError | null (Value Object)
│  └─ message: string
├─ createdAt: Date
└─ fileSize: number (bytes)
```

### Value Objects

#### 1. ExportOptions
- **fileName**: 내보낼 파일명 (확장자 제외, null이면 자동 생성)
- **width**: 이미지 너비 (null이면 원본 크기)
- **height**: 이미지 높이 (null이면 원본 크기)
- **scale**: 배율 (기본값 1, PNG에만 적용)

**책임**:
- Export 옵션 유효성 검증
- 크기 값이 양수인지 확인
- 파일명에 특수문자 제한

#### 2. ExportError
- **message**: 에러 메시지

**책임**:
- Export 실패 정보 캡슐화

### Enums

#### ImageFormat
```typescript
enum ImageFormat {
  PNG = 'png',
  SVG = 'svg'
}
```

#### ExportStatus
```typescript
enum ExportStatus {
  PENDING = 'pending',     // Export 대기
  SUCCESS = 'success',     // Export 성공
  FAILED = 'failed'        // Export 실패
}
```

---

## 비즈니스 규칙 (Invariants)

1. **소스 SVG는 비어있을 수 없음**: `sourceSvg`가 빈 문자열이면 생성 불가
2. **크기 값은 양수**: `width`, `height`, `scale`은 0보다 커야 함
3. **Export 성공 시 데이터 필수**: `exportStatus === SUCCESS`이면 `imageData`는 null이 아님
4. **Export 실패 시 에러 필수**: `exportStatus === FAILED`이면 `error`는 null이 아님
5. **파일명 유효성**: 파일명에 `/`, `\`, `:` 등 특수문자 사용 불가
6. **PNG는 크기 조정 가능, SVG는 원본 유지**: SVG 포맷 선택 시 width/height/scale 무시

---

## 주요 메서드

### `create(sourceSvg: string, format: ImageFormat, options?: ExportOptions): DiagramImage`
- 새로운 DiagramImage 생성
- SVG 유효성 검증
- 옵션 검증
- 이벤트 발행: `ImageExportRequested`

### `export(): void`
- SVG를 지정된 포맷으로 변환
- PNG: 브라우저 Canvas API 또는 puppeteer 사용
- SVG: 원본 SVG 그대로 반환 (크기 조정 없음)
- 이벤트 발행: `ImageExported` 또는 `ImageExportFailed`

### `getImageData(): Buffer | string`
- 변환된 이미지 데이터 반환
- PNG: Buffer, SVG: string
- `exportStatus !== SUCCESS`이면 예외 발생

### `getFileName(): string`
- 파일명 반환 (확장자 포함)
- `options.fileName`이 null이면 자동 생성 (예: `diagram-{timestamp}.{format}`)

### `resize(width: number, height: number): void`
- PNG 이미지 크기 재조정
- SVG 포맷이면 예외 발생
- 재변환 수행
- 이벤트 발행: `ImageResized`

---

## 발생 이벤트

- `ImageExportRequested`: Export 요청 시
- `ImageExported`: Export 성공 시
- `ImageExportFailed`: Export 실패 시
- `ImageResized`: 크기 조정 시

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
> - `documents/domain-modeling/export/events.md`
> - `documents/domain-modeling/export/language.md`

# 데이터베이스 설계

> 📋 **문서 목적**: Mermaid Saiko 프로젝트의 데이터베이스 설계

**마지막 업데이트**: 2025-10-26

---

## 현재 상태 (Phase 1+2)

**데이터베이스 사용하지 않음** - 인메모리 저장소만 사용

### 이유
- 프로젝트 범위에 저장 기능 제외 (PROJECT-OVERVIEW.md 참조)
- 렌더링은 일회성 작업 (저장 불필요)
- 단순성 및 배포 용이성 우선

### 인메모리 저장소

#### DiagramRepository (메모리)
```typescript
class InMemoryDiagramRepository {
  private diagrams: Map<string, Diagram> = new Map();

  save(diagram: Diagram): void {
    this.diagrams.set(diagram.id, diagram);
  }

  findById(id: string): Diagram | null {
    return this.diagrams.get(id) || null;
  }

  // TTL (Time To Live): 1시간 후 자동 삭제
  // 메모리 관리를 위해 주기적으로 오래된 항목 제거
}
```

**특징**:
- 서버 재시작 시 데이터 손실 (의도된 동작)
- TTL 1시간 (메모리 관리)
- 동시성 제어 불필요 (단일 인스턴스)

---

## 향후 확장 (Phase 3)

만약 다이어그램 저장 기능이 추가되면 PostgreSQL 사용 예정

### 테이블 설계 (예상)

#### 1. `diagrams` 테이블

**설명**: 렌더링된 다이어그램 저장

**스키마**:
| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 다이어그램 ID |
| mermaid_code | TEXT | NOT NULL | 원본 Mermaid 코드 |
| rendered_svg | TEXT | NOT NULL | 렌더링된 SVG |
| diagram_type | VARCHAR(50) | NOT NULL | 다이어그램 타입 |
| render_status | VARCHAR(20) | NOT NULL | 렌더링 상태 |
| error_message | TEXT | NULL | 에러 메시지 (실패 시) |
| created_at | TIMESTAMP | NOT NULL DEFAULT NOW() | 생성 일시 |
| updated_at | TIMESTAMP | NOT NULL DEFAULT NOW() | 수정 일시 |

**인덱스**:
- `idx_diagrams_created_at` (created_at DESC) - 최근 다이어그램 조회

**제약조건**:
- `render_status IN ('pending', 'success', 'failed')`

**TTL 정책**:
- 30일 이후 자동 삭제 (PostgreSQL 파티셔닝 또는 cron job)

---

#### 2. `diagram_images` 테이블

**설명**: Export된 이미지 메타데이터 (이미지 파일은 S3/Object Storage)

**스키마**:
| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 이미지 ID |
| diagram_id | UUID | FK, NOT NULL | 다이어그램 ID |
| format | VARCHAR(10) | NOT NULL | 이미지 포맷 (png, svg) |
| file_name | VARCHAR(255) | NOT NULL | 파일명 |
| file_size | INTEGER | NOT NULL | 파일 크기 (bytes) |
| width | INTEGER | NULL | 이미지 너비 (px) |
| height | INTEGER | NULL | 이미지 높이 (px) |
| storage_url | TEXT | NOT NULL | 저장소 URL (S3 등) |
| created_at | TIMESTAMP | NOT NULL DEFAULT NOW() | 생성 일시 |

**인덱스**:
- `idx_diagram_images_diagram_id` (diagram_id)

**외래키**:
- `diagram_id` → `diagrams(id)` ON DELETE CASCADE

---

#### 3. `editor_sessions` 테이블 (선택적)

**설명**: 웹 에디터 세션 (협업 기능 추가 시)

**Phase 1+2**: 불필요 (클라이언트 사이드만)

**Phase 3**: 협업 기능 추가 시 고려

**스키마** (예상):
| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 세션 ID |
| current_code | TEXT | NOT NULL | 현재 코드 |
| user_id | UUID | NULL | 사용자 ID (인증 추가 시) |
| last_active_at | TIMESTAMP | NOT NULL | 마지막 활동 시간 |
| created_at | TIMESTAMP | NOT NULL DEFAULT NOW() | 세션 생성 일시 |

**TTL**: 24시간 비활성 후 삭제

---

## Repository 패턴

### Interface (Domain Layer)
```typescript
interface DiagramRepository {
  save(diagram: Diagram): Promise<void>;
  findById(id: string): Promise<Diagram | null>;
  delete(id: string): Promise<void>;
}
```

### 구현체 (Infrastructure Layer)

#### InMemoryDiagramRepository (Phase 1+2)
```typescript
class InMemoryDiagramRepository implements DiagramRepository {
  private diagrams: Map<string, Diagram> = new Map();
  // 구현...
}
```

#### TypeOrmDiagramRepository (Phase 3)
```typescript
class TypeOrmDiagramRepository implements DiagramRepository {
  constructor(
    @InjectRepository(DiagramEntity)
    private readonly repository: Repository<DiagramEntity>
  ) {}

  async save(diagram: Diagram): Promise<void> {
    const entity = DiagramEntity.fromDomain(diagram);
    await this.repository.save(entity);
  }

  // 구현...
}
```

---

## 마이그레이션 전략 (Phase 1+2 → Phase 3)

### 1단계: Repository 인터페이스는 동일하게 유지
- Domain Layer는 변경 없음
- Infrastructure Layer만 교체

### 2단계: DI 설정 변경
```typescript
// Phase 1+2
providers: [
  { provide: DiagramRepository, useClass: InMemoryDiagramRepository }
]

// Phase 3
providers: [
  { provide: DiagramRepository, useClass: TypeOrmDiagramRepository }
]
```

### 3단계: 데이터베이스 추가
- Docker Compose에 PostgreSQL 추가
- TypeORM 설정
- 마이그레이션 스크립트 실행

---

## 승인 상태

**전체 승인 상태**: ✅ (승인 완료 - 2025-10-26)

**승인 체크리스트**:
- [x] Phase 1+2 인메모리 저장소 승인
- [x] Phase 3 테이블 설계 승인
- [x] Repository 패턴 승인
- [x] 마이그레이션 전략 승인

---

> 📎 **관련 문서**:
> - `documents/architecture/system-overview.md`
> - `documents/architecture/technology-stack.md`
> - `documents/domain-modeling/rendering/aggregates.md`

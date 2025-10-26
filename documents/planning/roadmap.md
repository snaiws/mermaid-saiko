# 프로젝트 로드맵 (Roadmap)

> 📋 **문서 목적**: Mermaid Saiko 프로젝트의 전체 진행 상황을 tree 형태로 관리

**마지막 업데이트**: 2025-10-27

---

## 진행 상황

```
Mermaid Saiko 프로젝트
│
├─ [x] 초기 설정
│   ├─ [x] 저장소 생성
│   ├─ [x] PROJECT-RULES.md 작성
│   └─ [x] CLAUDE.md 작성
│
├─ [x] 1단계: 기획
│   ├─ [x] planning 폴더 생성
│   ├─ [x] PROJECT-OVERVIEW.md 작성
│   ├─ [x] PROJECT-OVERVIEW.md 사용자 승인
│   ├─ [x] roadmap.md 초기 버전 작성
│   └─ [x] open-questions.md 초기 버전 작성
│
├─ [x] 2단계: 기능 요구사항
│   ├─ [x] requirements 폴더 생성
│   ├─ [x] 기능 카테고리 정의 (RENDER, EXPORT, EDITOR)
│   ├─ [x] render-requirements.md 작성 (5개 기능)
│   ├─ [x] export-requirements.md 작성 (5개 기능)
│   ├─ [x] editor-requirements.md 작성 (3개 기능)
│   └─ [x] 모든 기능 승인 완료
│
├─ [x] 3단계: 도메인 모델링
│   ├─ [x] domain-modeling 폴더 생성
│   ├─ [x] Bounded Context 정의 (3개: Editor, Rendering, Export)
│   │   └─ [x] bounded-contexts.md 작성 및 승인
│   ├─ [x] Context별 폴더 생성 (editor/, rendering/, export/)
│   ├─ [x] 각 Context별 Aggregate 설계
│   │   ├─ [x] rendering/aggregates.md 작성 (Diagram Aggregate)
│   │   ├─ [x] export/aggregates.md 작성 (DiagramImage Aggregate)
│   │   └─ [x] editor/aggregates.md 작성 (EditorSession Aggregate)
│   ├─ [x] Domain Event 정의
│   │   ├─ [x] rendering/events.md 작성 (4개 이벤트)
│   │   ├─ [x] export/events.md 작성 (4개 이벤트)
│   │   └─ [x] editor/events.md 작성 (5개 이벤트)
│   └─ [x] Ubiquitous Language 정리
│       ├─ [x] rendering/language.md 작성
│       ├─ [x] export/language.md 작성
│       └─ [x] editor/language.md 작성
│
├─ [x] 4단계: API 설계
│   ├─ [x] api 폴더 생성
│   ├─ [x] Context별 API 명세 작성
│   │   ├─ [x] rendering-api.md 작성 (3개 엔드포인트)
│   │   ├─ [x] export-api.md 작성 (3개 엔드포인트)
│   │   └─ [x] editor-api.md 작성 (클라이언트 사이드 구현 가이드)
│   └─ [x] API 명세 승인 완료
│
├─ [x] 5단계: 아키텍처 + DB 설계
│   ├─ [x] architecture 폴더 생성
│   ├─ [x] 전체 시스템 구조 설계
│   │   └─ [x] system-overview.md 작성
│   ├─ [x] 기술 스택 선정
│   │   ├─ [x] 언어 및 핵심 프레임워크 선정
│   │   ├─ [x] 기능별 라이브러리 조사 및 선정
│   │   └─ [x] technology-stack.md 작성
│   ├─ [N/A] 마이크로서비스 설계 (모놀리식 선택으로 불필요)
│   ├─ [x] 데이터베이스 설계
│   │   └─ [x] database-design.md 작성
│   ├─ [x] 이벤트 기반 설계
│   │   └─ [x] event-driven-design.md 작성
│   └─ [x] 프론트엔드 아키텍처
│       └─ [x] frontend-architecture.md 작성
│
└─ [ ] 6단계: 개발
    ├─ [x] 프로젝트 구조 생성
    │   ├─ [x] 백엔드 프로젝트 초기화
    │   ├─ [x] 프론트엔드 프로젝트 초기화
    │   └─ [x] Docker 설정
    │
    ├─ [x] Domain Layer 구현
    │   ├─ [x] Aggregate 구현
    │   ├─ [x] Value Object 구현
    │   ├─ [x] Domain Event 구현
    │   └─ [x] 비즈니스 로직 구현
    │
    ├─ [x] Application Layer 구현
    │   ├─ [x] Use Case 구현
    │   ├─ [x] Command/Query 분리
    │   └─ [ ] Event Handler 구현
    │
    ├─ [x] Infrastructure Layer 구현
    │   ├─ [x] TypeORM Entities 생성
    │   ├─ [x] Repository 구현 (Mapper 포함)
    │   ├─ [x] Database Module 설정
    │   ├─ [x] External Service 구현 (Puppeteer 기반)
    │   └─ [x] Event Bus 구현 (NestJS EventEmitter)
    │
    ├─ [x] API Layer 구현
    │   ├─ [x] Request/Response DTO 정의
    │   ├─ [x] Rendering Controller (POST /render, GET /diagram/:id)
    │   ├─ [x] Export Controller (POST /png, POST /svg)
    │   ├─ [x] Validation (class-validator)
    │   ├─ [x] Error Handling (Exception Filters)
    │   └─ [x] API Modules 통합
    │
    ├─ [ ] Frontend 구현
    │   ├─ [ ] 페이지 컴포넌트 구현
    │   ├─ [ ] 공통 컴포넌트 구현
    │   ├─ [ ] 상태 관리 구현
    │   └─ [ ] API 연동
    │
    ├─ [ ] 테스트 작성
    │   ├─ [ ] Unit Test (Domain)
    │   ├─ [ ] Integration Test (Application)
    │   ├─ [ ] E2E Test (API)
    │   └─ [ ] Frontend Test
    │
    └─ [x] 배포 준비
        ├─ [x] Docker Compose 설정
        ├─ [x] 환경 변수 설정
        ├─ [x] 빌드 스크립트 작성
        └─ [x] README 작성 (실행 방법)
```

---

## 현재 진행 중

**단계**: 6단계 진행 중 (API Layer 완료)

**현재 작업**: Frontend 구현 준비

**다음 작업**: 페이지 컴포넌트, 상태 관리, API 연동 구현

---

## 완료된 마일스톤

- ✅ 2025-10-26: 프로젝트 초기 설정 완료
- ✅ 2025-10-26: 1단계 기획 완료 (PROJECT-OVERVIEW.md 승인)
- ✅ 2025-10-26: 2단계 기능 요구사항 완료 (13개 기능 정의 및 승인)
- ✅ 2025-10-26: 3단계 도메인 모델링 완료 (3개 Context, 3개 Aggregate, 13개 Event)
- ✅ 2025-10-26: 4단계 API 설계 완료 (6개 REST 엔드포인트, 클라이언트 구현 가이드)
- ✅ 2025-10-26: 5단계 아키텍처 설계 완료 (모놀리식, DDD 레이어드, 기술 스택 선정)
- ✅ 2025-10-26: 6단계 프로젝트 구조 생성 완료 (백엔드/프론트엔드 초기화, Docker, README)
- ✅ 2025-10-26: Domain Layer 구현 완료 (3개 Aggregate, 9개 Value Object, 13개 Domain Event)
- ✅ 2025-10-26: Application Layer 구현 완료 (3개 Use Case, Command/Query DTO, Repository/Service 인터페이스)
- ✅ 2025-10-27: Infrastructure Layer 구현 완료 (TypeORM Entities, Repository, External Services, Event Bus)
- ✅ 2025-10-27: API Layer 구현 완료 (Controllers, DTOs, Validation, Error Handling)

---

## 예정된 마일스톤

- 🔲 6단계 완료: 개발 및 배포 완료

---

> 📎 **관련 문서**:
> - `documents/planning/PROJECT-OVERVIEW.md`
> - `documents/planning/open-questions.md`

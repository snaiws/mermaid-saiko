# 프로젝트 진행 규칙

> 📋 **이 문서는 프로젝트의 모든 진행 규칙을 정의합니다.**
>
> 새 세션을 시작할 때마다 이 문서를 먼저 읽어야 합니다.

---

## 📌 중요 원칙

1. **문서 우선주의**: 코드보다 문서가 먼저
2. **승인 기반 진행**: 체크박스 없이는 진행 불가
3. **명시적 의사소통**: 추측 금지, 질문 필수
4. **점진적 완성**: 한 번에 모든 것을 하지 않음
5. **Git으로 관리**: 모든 변경사항은 Git에 기록
6. **세션 노트 불필요**: 작업 내용은 해당 문서에 바로 반영
7. **매 작업마다 roadmap.md 업데이트**: 진행 상황을 실시간으로 체크박스 업데이트
8. **open-questions.md 적극 활용**:
   - 미결정 사항은 즉시 추가
   - 해결된 질문은 관련 문서 업데이트 후 삭제
   - 추가 작업 필요 시 roadmap.md에 TODO 추가
9. **개발 작업 전 open-questions.md 확인**: 관련 질문이 있는지 먼저 체크
10. **⭐ 능동적 검토 및 제안 (Critical)**:
    - 사용자 의견에 대해 **항상** 비판적 검토 수행
    - 잠재적 문제점, 개선 방안, 놓친 부분 적극 제안
    - 단순 수용이 아닌, 더 나은 방향 제시
    - 사용자 결정 존중하되, 충분한 정보 제공 후 결정하도록 지원

---

## 📂 문서 구조 및 역할

### `documents/` = 기획 단계 문서
> ⚠️ **중요**: 모든 구현은 `documents/`의 문서가 완성된 후에만 시작합니다.

```
documents/
├── PROJECT-RULES.md                 # 이 문서 (진행 규칙)
├── README.md                        # 문서 구조 설명
│
├── planning/                        # 📅 계획 문서
│   ├── PROJECT-OVERVIEW.md         # 프로젝트 개요 (제안서/기획서)
│   ├── roadmap.md                  # 프로젝트 진행 상황 (tree 형태)
│   └── open-questions.md           # 미결정 질문 목록
│
├── requirements/                    # 📋 요구사항 문서
│   ├── functional-requirements.md  # 기능 요구사항 (문답 기반)
│   ├── non-functional-requirements.md  # 비기능 요구사항
│   ├── api-specifications.md       # API 명세 (구현 전 완성)
│   └── user-stories.md             # 사용자 스토리 (선택)
│
├── domain-modeling/                 # 🧩 도메인 모델링
│   ├── bounded-contexts.md         # Bounded Context 정의
│   ├── aggregates.md               # Aggregate 설계
│   ├── domain-events.md            # Domain Event 정의
│   ├── ubiquitous-language.md      # 공통 언어 사전
│   └── context-mapping.md          # Context 간 관계
│
└── architecture/                    # 🏗️ 아키텍처 문서
    ├── system-overview.md          # 전체 시스템 구조
    ├── microservices-design.md     # 마이크로서비스 설계
    ├── database-design.md          # DB 스키마 설계
    ├── event-driven-design.md      # 이벤트 기반 설계
    └── technology-stack.md         # 기술 스택 선정
```

### requirements/ 디렉토리 구조 규칙

**원칙**: 요구사항 카테고리(기능들의 개념적 묶음 단위) 기준으로 파일 분리

**구조**:
```
requirements/
└── {category-lowercase}-requirements.md
```

**예시**: AUTH → auth-requirements.md, WORK → workspace-requirements.md

### domain-modeling/ 디렉토리 구조 규칙

**원칙**: Bounded Context 기준으로 폴더 분리

**구조**:
```
domain-modeling/
├── {context-name}/
│   ├── aggregates.md   # 해당 Context의 Aggregate들
│   ├── events.md       # 해당 Context의 Domain Event들
│   └── language.md     # 해당 Context의 용어
└── bounded-contexts.md # 전체 Context 개요 (통합 유지)
```

**예시**: Identity Context → identity/, Task Context → task/

### api/ 디렉토리 구조 규칙

**원칙**: Bounded Context 기준으로 파일 분리

**구조**:
```
api/
├── identity-api.md      # Identity Context API (8개)
├── task-api.md          # Task Context API (54개, Workspace 포함)
└── notification-api.md  # Notification Context API (8개)
```

**작성 규칙**:
- **Swagger 전제**: 상세 타입/validation은 Swagger가 자동 생성
- **간결한 표 형식**: 기능 ID, Method, Endpoint, Request, Response, 비고만 표기
- **에러 코드는 구현 시 정의**: Stage 6 (개발) 단계에서 정의
- **응답 구조는 2-layer**: HTTP Layer (통신) + Data Layer (데이터)

**예시**:
```markdown
| 기능 ID | Method | Endpoint | Request | Response | 권한 | 비고 |
|---------|--------|----------|---------|----------|------|------|
| AUTH-01 | POST | /auth/signup | email, password, name? | userId, token | - | 워크스페이스 자동생성 |
```

---

## 🎯 개발 전반 과정 단계 정의

> 📋 **이 단계 정의는 모든 프로젝트에 재사용 가능합니다**

### 단계 개요

**1단계: 기획** → **2~5단계: 설계** → **6단계: 개발**

**철학**: 개발자가 Git에 기획문서를 작성하는 것 = 개발과 기획의 통합

---

### 1단계: 기획

**목표**: 무엇을, 왜 만드는가

**산출물**:
- `PROJECT-OVERVIEW.md` (제안서/기획서)
  - 배경 (프로젝트 배경, 도메인 설명)
  - 문제 정의
  - 해결 방법 (간략)
  - 기대 효과
  - 사용자 주체
ㅈw
**완료 조건**:
- [ ] 프로젝트 배경 작성
- [ ] 문제 정의 명확화
- [ ] 해결 방법 설명
- [ ] 사용자 승인

---

### 2단계: 기능 요구사항

**목표**: 어떤 기능을 만들 것인가 (순수하게 사용자 관점)

**산출물**:
- `requirements/functional-requirements.md`
  - **순수 기능 목록** (도메인 용어 사용 금지)
  - **테이블 형식**으로 작성
  - 비개발자도 이해 가능한 수준

**작성 규칙**:
- ❌ **Context, Aggregate, Entity 같은 DDD 용어 사용 금지**
- ❌ **도메인 모델링 관점 금지** (예: "Identity Context", "Task Context")
- ❌ **API 명세 작성 금지** (예: Request/Response, 엔드포인트)
- ✅ **테이블 형식 사용** (아래 템플릿 참조)
- ✅ **기능명은 명사형** (예: "회원가입", "로그인", NOT "회원가입하기")
- ✅ **기능 중심 그룹화** (예: "회원 관리", "작업 관리")

**테이블 형식 (필수)**:
```markdown
## {카테고리명}

| 요구사항 ID | 요구사항명 | 기능 ID | 기능명 | 상세 설명 | 필수 데이터 | 선택 데이터 | 승인 |
|------------|-----------|---------|--------|----------|------------|------------|------|
| AUTH | 회원 인증 | AUTH-01 | 회원가입 | 사용자가 이메일과 비밀번호로 계정을 생성한다 | 이메일, 비밀번호 | 이름 | ✅ |
| AUTH | 회원 인증 | AUTH-02 | 로그인 | 사용자가 로그인하여 서비스에 접근한다 | 이메일, 비밀번호 | - | ✅ |
```

**완료 조건**:
- [ ] 모든 기능 정의 완료
- [ ] 모든 기능 승인 체크박스 체크
- [ ] 미결정 사항은 `open-questions.md`에 기록

**⚠️ 중요**:
- **도메인 구조는 3단계(도메인 모델링)에서 정의**. 2단계는 순수 기능만!
- **API 설계는 4단계에서 수행**. 2단계에서는 엔드포인트/Request/Response 작성 금지!

**참고**:
- 비기능 요구사항은 작성하지 않음 (프로젝트 시작 전엔 불필요)
- 테이블 형식 사용 시 문서 길이 ~200줄 목표 (1000줄+ 금지)

---

### 3단계: 도메인 모델링

**목표**: 비즈니스 로직을 DDD로 설계 (여기서 비로소 도메인 구조 정의!)

**산출물**:
- `domain-modeling/bounded-contexts.md` - Bounded Context 정의 (**여기서 Context 나눔!**)
- `domain-modeling/aggregates.md` - Aggregate 설계 (Entity/Value Object 구분)
- `domain-modeling/domain-events.md` - Domain Event 정의
- `domain-modeling/ubiquitous-language.md` - 공통 언어 사전

**작성 규칙**:
- ✅ **여기서 비로소 Context로 나눔** (Identity Context, Task Context 등)
- ✅ **2단계의 기능을 Context별로 재구성**
- ✅ **Aggregate Root, Entity, Value Object 구분**
- ✅ **도메인 이벤트 정의**

**완료 조건**:
- [ ] 모든 Bounded Context 정의 완료
- [ ] 각 Context의 Aggregate 설계 완료
- [ ] Domain Event 목록 작성 완료
- [ ] Ubiquitous Language 정리 완료

**⚠️ 핵심**: **2단계는 기능, 3단계는 도메인 구조**. 혼동 금지!

**특징**: 2단계(기능 요구사항)와 병렬/반복 작업 가능

---

### 4단계: API 설계

**목표**: 인터페이스 명세 정의

**산출물**:
- `api/api-specifications.md`
  - 모든 엔드포인트 정의
  - Request/Response 스펙
  - 인증/인가 방식

**완료 조건**:
- [ ] 모든 API 엔드포인트 정의 완료
- [ ] Request/Response 예시 작성

---

### 5단계: 아키텍처 + DB 설계

**목표**: 기술 구조 및 데이터 구조 설계

**산출물**:
- `architecture/system-overview.md` - 전체 시스템 개요
- `architecture/technology-stack.md` - 기술 스택 선정 및 이유
  - **1부: 언어 및 핵심 프레임워크 선정** (TypeScript, NestJS, PostgreSQL 등)
  - **2부: 기능별 라이브러리 후보 조사 및 선정** (인증, Validation, File Upload 등)
- `architecture/microservices-design.md` - 서비스 간 통신 설계
- `architecture/database-design.md` - DB 스키마, 인덱스, 제약조건
- `architecture/event-driven-design.md` - 이벤트 플로우 설계
- `architecture/frontend-architecture.md` - 프론트엔드 아키텍처 설계 (페이지 구조, 라우팅, 컴포넌트 계층, 상태 관리)

**완료 조건**:
- [ ] 전체 아키텍처 확정
- [ ] 기술 스택 선정 완료
  - [ ] 언어 및 핵심 프레임워크 선정 완료
  - [ ] 기능별 라이브러리 후보 조사 및 선정 완료
- [ ] 서비스별 DB 스키마 정의 완료
- [ ] 이벤트 플로우 설계 완료
- [ ] 프론트엔드 아키텍처 설계 완료
  - [ ] 페이지 구조 및 라우팅 정의
  - [ ] 컴포넌트 계층 설계
  - [ ] 상태 관리 전략 수립
  - [ ] 폴더 구조 정의

**⚠️ 중요 원칙**:
1. **모든 후보를 문서에 남김**: 선정되지 않은 라이브러리도 장단점과 함께 기록 (나중에 재평가 가능)
2. **웹검색 필수**: 라이브러리 조사 시 반드시 웹검색으로 최신 정보, 커뮤니티 동향, 버전, 이슈 확인
3. **프론트엔드 설계는 최소화**: 페이지 구조, 라우팅, 컴포넌트 계층만 정의하고 나머지는 구현하면서 조정

---

### 6단계: 개발

**목표**: 코드 구현

**진행 방식**:
1. 프로젝트 구조 생성
2. Domain Layer 구현 (순수 TypeScript)
3. Application Layer 구현 (Use Cases)
4. Infrastructure Layer 구현 (NestJS, TypeORM)
5. API Layer 구현 (Controllers)
6. 테스트 작성

**시작 조건**: 1~5단계의 모든 문서 완성 및 승인

---

## 🔄 세션 진행 규칙

### 세션 시작 시 (필수 체크리스트)

1. [ ] `planning/roadmap.md` 확인 (프로젝트 진행 상황)
2. [ ] `planning/open-questions.md` 확인 (미결정 사항)
3. [ ] 이번 세션 목표 설정

### 세션 진행 중

#### 기획 단계 (현재)
```
1. 요구사항 문답
   └─ functional-requirements.md 업데이트
   └─ 각 기능마다 승인 체크박스 체크

2. 도메인 모델링
   └─ bounded-contexts.md 업데이트
   └─ aggregates.md 작성
   └─ domain-events.md 작성

3. 아키텍처 설계
   └─ system-overview.md 작성
   └─ microservices-design.md 작성
   └─ database-design.md 작성

4. API 명세 작성
   └─ api-specifications.md 작성
```

#### 구현 단계 (기획 완료 후)
```
1. 프로젝트 구조 생성
2. 도메인 레이어 구현 (순수 TypeScript)
3. 애플리케이션 레이어 구현 (Use Cases)
4. 인프라 레이어 구현 (NestJS, TypeORM)
5. 테스트 작성
6. API 구현
```

### 세션 종료 시 (필수)

1. [ ] `planning/roadmap.md` 업데이트 (진행 상황 체크)
2. [ ] 미결정 사항은 `open-questions.md`에 추가
3. [ ] Git commit (작업 내용 기록)

---

## ✅ 승인 체크리스트 시스템

### 원칙
- **모든 기능은 체크박스로 승인 여부 표시**
- **체크박스가 모두 체크되어야만 다음 단계 진행**
- **사용자(당신)만 체크박스를 체크할 권한 있음**

### 체크박스 사용 규칙

#### ✅ 승인 완료
```markdown
- [x] 기능명
```
→ 사용자가 확인하고 승인한 상태

#### ❌ 승인 대기
```markdown
- [ ] 기능명
```
→ 아직 논의 중이거나 확인 필요

#### 📝 승인 상태 표시
```markdown
**승인 상태**: ✅ (승인 완료)
**승인 상태**: ❌ (문답 필요)
**승인 상태**: ⏳ (검토 중)
```

---

## 💬 문답 진행 규칙

### Claude(AI)의 역할
1. **질문 제시**: 각 기능에 대해 상세히 질문
2. **옵션 제공**: 가능한 선택지와 제안 제공
3. **⭐ 비판적 검토**: 사용자 의견의 잠재적 문제점, 개선 방안, 놓친 부분 제안
4. **문서 작성**: 답변 받은 내용을 문서에 정리
5. **검증**: 비즈니스 규칙 충돌 여부 확인

### 사용자(당신)의 역할
1. **답변 제공**: Claude의 질문에 답변
2. **승인 결정**: 각 기능/설계에 대한 최종 승인
3. **우선순위 결정**: 어떤 것부터 할지 결정
4. **피드백 제공**: 잘못된 부분 수정 요청

### 문답 템플릿
```markdown
## [기능명]

**Claude 질문**:
Q1. [질문 내용]
Q2. [질문 내용]

**사용자 답변**:
A1. [답변]
A2. [답변]

**Claude 정리**:
[답변 기반으로 정리된 내용]

**사용자 승인**: [ ] (체크 필요)
```

---

## 📝 문서 작성 규칙

### 문서 업데이트 시

1. **변경 이력 없음** (Git으로 관리)
   - 문서는 항상 최신 상태로 덮어쓰기
   - 이전 버전은 Git history에서 확인

2. **상호 참조 필수**
   ```markdown
   > 📎 **관련 문서**: requirements/functional-requirements.md
   > 📎 **참조**: domain-modeling/aggregates.md
   ```

3. **결정 사항 명시**
   ```markdown
   **결정**: [날짜] - [결정 내용]
   **이유**: [결정 이유]
   ```

4. **미결정 사항 표시**
   ```markdown
   > ⚠️ **미결정**: open-questions.md Q7 참조
   ```

---

## 🚫 금지 사항

### Claude가 하지 말아야 할 것

1. ❌ **임의로 체크박스 체크**
   - 사용자 승인 없이 절대 체크 금지

2. ❌ **구현 코드 먼저 작성**
   - 기획 문서가 완성되기 전 구현 금지

3. ❌ **사용자 의도 추측**
   - 확실하지 않으면 반드시 질문

4. ❌ **문서 없이 진행**
   - 구두로만 합의하고 넘어가기 금지
   - 모든 내용은 문서화 필수

5. ❌ **기능 임의 추가**
   - 사용자가 요청하지 않은 기능 추가 금지

### 개발 시 금지 사항

6. ❌ **멍키 패치 (Monkey Patching) 금지**
   - 런타임에 클래스나 모듈 수정 금지
   - 예: `Array.prototype.customMethod = ...`

7. ❌ **개발 초기 단계 무분별한 try-catch 사용 금지**
   - 에러를 숨기지 말고 명확히 드러내기
   - 필요한 경우에만 명시적으로 처리

8. ❌ **개발 초기 단계 무분별한 로깅 금지**
   - console.log 남발 금지
   - 필요 시 적절한 로깅 라이브러리 사용

---

## 🎯 구현 시작 조건

다음 **모든** 조건이 충족되어야 구현 시작 가능:

### 필수 문서 완성 체크리스트

- [ ] `requirements/functional-requirements.md`
  - [ ] 모든 Context의 승인 완료
  - [ ] 모든 기능의 상세 정의 완료

- [ ] `requirements/non-functional-requirements.md`
  - [ ] 성능 요구사항 정의
  - [ ] 보안 요구사항 정의

- [ ] `requirements/api-specifications.md`
  - [ ] 모든 API 엔드포인트 정의
  - [ ] Request/Response 스펙 완성

- [ ] `domain-modeling/bounded-contexts.md`
  - [ ] 모든 Context 정의 완료

- [ ] `domain-modeling/aggregates.md`
  - [ ] 모든 Aggregate 설계 완료
  - [ ] Entity/Value Object 구분 명확

- [ ] `domain-modeling/domain-events.md`
  - [ ] 모든 Domain Event 정의 완료

- [ ] `architecture/system-overview.md`
  - [ ] 전체 시스템 구조 확정

- [ ] `architecture/microservices-design.md`
  - [ ] 서비스 분리 기준 명확
  - [ ] 통신 방식 결정

- [ ] `architecture/database-design.md`
  - [ ] 모든 테이블 스키마 정의
  - [ ] 서비스별 DB 분리 명확

- [ ] `architecture/event-driven-design.md`
  - [ ] 이벤트 플로우 설계 완료

---

## 📝 문서 작성 가이드

> 각 단계별 문서 작성 시 참고할 템플릿 및 가이드
>
> **중요**: 세션 노트 작성 불필요. 모든 작업 내용은 해당 문서에 바로 반영

---

### functional-requirements.md 작성 가이드

**구조** (테이블 형식):
```markdown
# 기능 요구사항

## 1️⃣ {카테고리명}

| 요구사항 ID | 요구사항명 | 기능 ID | 기능명 | 상세 설명 | 필수 데이터 | 선택 데이터 | 승인 |
|------------|-----------|---------|--------|----------|------------|------------|------|
| {PREFIX} | {요구사항명} | {PREFIX}-01 | {기능명} | {사용자가 ~한다} | {데이터1, 데이터2} | {데이터3} | ✅/❌ |
| {PREFIX} | {요구사항명} | {PREFIX}-02 | {기능명} | {사용자가 ~한다} | {데이터1} | - | ✅/❌ |
```

**예시**:
```markdown
## 1️⃣ AUTH - 회원 인증

| 요구사항 ID | 요구사항명 | 기능 ID | 기능명 | 상세 설명 | 필수 데이터 | 선택 데이터 | 승인 |
|------------|-----------|---------|--------|----------|------------|------------|------|
| AUTH | 회원 인증 | AUTH-01 | 회원가입 | 사용자가 이메일과 비밀번호로 계정을 생성한다 | 이메일, 비밀번호 | 이름 | ✅ |
| AUTH | 회원 인증 | AUTH-02 | 로그인 | 사용자가 이메일과 비밀번호로 로그인한다 | 이메일, 비밀번호 | - | ✅ |
```

**작성 규칙**:
1. **기능명은 명사형** (예: "회원가입", NOT "회원가입하기")
2. **상세 설명은 "사용자가 ~한다" 형식**
3. **필수 데이터와 선택 데이터 구분**
4. **비개발자도 이해 가능한 수준**으로 작성
5. **DDD 용어 (Context, Aggregate 등) 사용 금지**
6. **API 상세 (엔드포인트, Request/Response) 작성 금지**

**작성 방법**:
1. Claude와 문답하며 각 기능의 상세 내용 채우기
2. 테이블 형식으로 간결하게 정리 (~200줄 목표)
3. 모든 내용 합의 후 사용자가 승인 체크박스 체크
4. 미결정 사항은 `open-questions.md`에 추가

---

### aggregates.md 작성 가이드

**구조**:
```markdown
## {Context명} Context

### {Aggregate명} (Root)

**책임**: [이 Aggregate가 담당하는 비즈니스 규칙]

**구조**:
```
AggregateRoot
├─ id (식별자)
├─ Entity1
│  ├─ field1
│  └─ field2
├─ ValueObject1
│  ├─ field1
│  └─ field2
└─ Entity2[]
```

**비즈니스 규칙 (Invariants)**:
1. {불변식 1} - 예: "Task의 Title은 비워둘 수 없음"
2. {불변식 2}

**주요 메서드**:
- `create()`: {설명}
- `update()`: {설명}
- `doSomething()`: {설명}

**발생 이벤트**:
- `EntityCreated`
- `EntityUpdated`
```

**작성 팁**:
- Entity vs Value Object 구분 명확히
- 불변식(Invariants)은 코드로 강제할 규칙

---

### domain-events.md 작성 가이드

**구조**:
```markdown
## {Context명} Context

### {EventName} (과거형)

**발생 시점**: [언제 이 이벤트가 발생하는가?]

**발행자**: {Aggregate명}

**페이로드**:
```typescript
{
  eventId: string;
  aggregateId: string;
  occurredAt: Date;
  // 추가 필드
  field1: type;
  field2: type;
}
```

**구독자**:
- {Service명} - {처리 내용}
- {Service명} - {처리 내용}

**비즈니스 의미**:
[이 이벤트가 비즈니스적으로 의미하는 것]
```

---

### api-specifications.md 작성 가이드

**구조**:
```markdown
## {Context명} API

### {기능명}

**Endpoint**: `POST /api/v1/tasks`

**인증**: Required (JWT)

**Request**:
```json
{
  "title": "string (required, 1-500자)",
  "description": "string (optional)",
  "projectId": "string (required, UUID)"
}
```

**Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "회의 자료 준비",
  "status": "TODO",
  "createdAt": "2024-10-08T10:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: {사유}
- `401 Unauthorized`: {사유}
- `404 Not Found`: {사유}

**비즈니스 규칙**:
- {규칙 1}
```

---

### database-design.md 작성 가이드

**구조**:
```markdown
## {Service명} Database

### 테이블: `tasks`

**설명**: Task Aggregate 저장

**스키마**:
| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | Task ID |
| title | VARCHAR(500) | NOT NULL | 제목 |
| status | VARCHAR(20) | NOT NULL | 상태 |
| project_id | UUID | FK, NOT NULL | 소속 프로젝트 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |

**인덱스**:
- `idx_tasks_project_id` (project_id)
- `idx_tasks_status` (status)

**외래키**:
- `project_id` → `projects(id)` ON DELETE CASCADE

**특이사항**:
- {특별히 주의할 점}
```

---

### technology-stack.md 작성 가이드

**구조**:
```markdown
# 기술 스택 (Technology Stack)

## 1️⃣ 언어 및 핵심 프레임워크 선정

### 언어

**선택**: TypeScript

**버전**: `^5.3.0`

**선정 이유**:
- (장점 나열)

**대안 검토**:
- **Go**: (장단점)
- **Java/Kotlin**: (장단점)

---

## 2️⃣ 기능별 라이브러리 선정

### {기능 카테고리} (예: 인증, Validation, File Upload)

#### {세부 기능} (예: 비밀번호 해싱)

**후보 조사**:

1. **{라이브러리명}** ⭐ **선정** (선정된 경우)
   - 버전: `^x.x.x`
   - 장점:
     - ...
   - 단점:
     - ...
   - 학습 자료: (풍부/보통/적음)
   - 웹검색 결과: (최신 버전, 이슈, 커뮤니티 동향)

2. **{대안 라이브러리 1}**
   - 버전: `^x.x.x`
   - 장점: ...
   - 단점: ...
   - 웹검색 결과: ...
   - **평가**: (제외 이유 또는 Phase 3 고려)

3. **{대안 라이브러리 2}**
   - 버전: `^x.x.x`
   - 장점: ...
   - 단점: ...
   - 웹검색 결과: ...
   - **평가**: (제외 이유)

**최종 선정**: {선정된 라이브러리}
**선정 이유**: (핵심 이유 1-2줄)
**참고**: (필요 시 Phase 3 마이그레이션 계획)
```

**작성 원칙** (필수):

1. ✅ **모든 후보를 문서에 남김**
   - 선정된 라이브러리뿐만 아니라 **선정되지 않은 모든 후보**도 기록
   - 나중에 "이게 더 나을 것 같은데?" 싶을 때 바로 재평가 가능
   - 팀원이 "왜 이걸 안 썼어요?" 질문할 때 답변 자료

2. ✅ **장점/단점 모두 기록**
   - 선정된 라이브러리의 단점도 숨기지 않음
   - 제외된 라이브러리의 장점도 명확히 기록
   - 객관적 비교 가능하도록

3. ✅ **웹검색 필수**
   - 각 라이브러리 조사 시 **반드시 웹검색** 수행
   - 확인 사항:
     - 최신 버전 (NPM, GitHub Release)
     - 최근 업데이트 날짜 (유지보수 활발한지)
     - GitHub Star, Weekly Download (인기도)
     - Open Issues 개수 (버그, 보안 이슈)
     - 커뮤니티 동향 (Reddit, Stack Overflow)
     - 비교 글 (vs 다른 라이브러리)
   - 검색 결과를 문서에 간략히 기록

4. ✅ **제외 이유 명시**
   - "왜 안 썼는지" 명확히 기록
   - Phase 3에서 재고려 가능성 있으면 명시

5. ✅ **버전 명시**
   - 재검토 시 버전 차이로 인한 변화 확인 가능

**예시 - 비밀번호 해싱**:

```markdown
#### 비밀번호 해싱

**후보 조사**:

1. **bcrypt** ⭐ **선정**
   - 버전: `^5.1.1`
   - 장점:
     - NestJS 생태계 표준 (튜토리얼 대부분 사용)
     - 충분한 보안성 (Blowfish 기반, 20년+ 검증)
     - 설치 간편 (순수 JS 구현 가능)
   - 단점:
     - argon2보다 해싱 속도 느림
     - 메모리 하드 알고리즘 아님
   - 웹검색 결과:
     - NPM: 주간 다운로드 300만+
     - GitHub: Star 7.5k, 최근 업데이트 2024-09
     - 이슈: 보안 취약점 없음 (CVE 없음)

2. **argon2**
   - 버전: `^0.31.0`
   - 장점:
     - 최신 알고리즘 (2015 Password Hashing Competition 우승)
     - bcrypt보다 보안성 높음 (메모리 하드)
     - 해싱 속도 빠름
   - 단점:
     - 네이티브 모듈 설치 필요 (node-gyp, 컴파일 이슈 가능)
     - NestJS 생태계 레퍼런스 적음
     - Docker 환경 빌드 추가 설정 필요
   - 웹검색 결과:
     - NPM: 주간 다운로드 100만+
     - GitHub: Star 3k, 활발히 유지보수
     - Reddit: "프로덕션에서는 argon2 추천" 의견 많음
   - **평가**: Phase 3에서 보안 강화 필요 시 전환 고려

3. **scrypt** (Node.js 내장)
   - 버전: Node.js 내장
   - 장점:
     - 외부 라이브러리 불필요
     - 메모리 하드 알고리즘
   - 단점:
     - bcrypt보다 보안성 낮음
     - 커뮤니티 사용률 매우 낮음
   - 웹검색 결과:
     - Stack Overflow: "bcrypt나 argon2 쓰세요" 답변 대부분
   - **평가**: 제외 (커뮤니티 신뢰도 낮음)

**최종 선정**: bcrypt
**선정 이유**:
- Phase 1+2에서는 개발 생산성과 안정성 우선
- 충분한 보안성 (현업에서 검증됨)
- 컴파일 이슈 없어 팀원 온보딩 용이
**참고**: Phase 3에서 보안 강화 필요 시 argon2로 마이그레이션 가능 (코드 변경 최소)
```

**작성 프로세스**:

1. 기능 목록 작성 (인증, Validation, File Upload, WebSocket, Email 등)
2. 각 기능별로 라이브러리 후보 3-5개 조사
3. **웹검색으로 최신 정보 수집** (버전, 다운로드 수, 이슈, 커뮤니티 반응)
4. 장단점 비교표 작성
5. 최종 선정 및 이유 명시
6. 선정되지 않은 후보도 평가와 함께 문서에 남김

---

### frontend-architecture.md 작성 가이드

**정의**: 프론트엔드의 전체 구조를 정의하는 문서. 코드 작성 전에 페이지, 컴포넌트, 상태, 폴더 구조를 계획하여 일관성 있는 개발을 가능하게 함.

**목표**:
- 개발자가 어디에 어떤 코드를 작성할지 명확히 알 수 있도록
- 컴포넌트 재사용성 극대화
- 상태 관리 책임 분리
- 협업 시 구조 혼란 방지

**핵심 원칙**:
1. **백엔드 API 기반 설계**: API 명세(api-specifications.md)의 엔드포인트를 기반으로 페이지 구조 도출
2. **최소 설계**: 세부 디자인/레이아웃은 구현 중 조정 가능. 구조만 명확히 정의
3. **일관성**: 명명 규칙, 폴더 구조, 컴포넌트 계층을 문서화하여 팀 전체가 동일한 패턴 사용
4. **기술 스택 참조**: technology-stack.md에서 선정한 프레임워크/라이브러리 기반으로 설계

---

**필수 포함 내용**:

**1. 페이지 구조 및 라우팅**
- 모든 페이지의 URL 경로 정의
- 페이지별 설명 (어떤 기능을 하는가)
- 인증 필요 여부 명시
- API 명세와 매핑 (어떤 API를 호출하는가)

**작성 방법**:
- 테이블 형식 권장 (경로, 페이지명, 설명, 인증 필요, 사용 API)
- 기능 요구사항(functional-requirements.md)과 API 명세(api-specifications.md)를 기반으로 도출
- 중첩 라우팅 구조 명시 (예: /workspaces/:id/projects/:projectId)

---

**2. 컴포넌트 계층 설계**
- 컴포넌트를 어떻게 분류할 것인가 (Atomic Design, Feature-based 등)
- 재사용 가능한 공통 컴포넌트 목록
- 컴포넌트 책임 범위 정의

**작성 방법**:
- 선택한 컴포넌트 분류 방식 명시 (Atomic Design 등)
- 각 계층별 컴포넌트 예시 나열
- 컴포넌트 명명 규칙 정의
- 너무 세부적으로 모든 컴포넌트 나열 불필요 (구현 중 추가 가능)

**일반적인 계층 분류 예시**:
- **Atomic Design**: atoms → molecules → organisms → templates → pages
- **Feature-based**: features/{feature}/components/ (도메인별 분리)
- **Hybrid**: common/components/ + pages/{page}/components/

---

**3. 상태 관리 전략**
- 전역 상태 vs 로컬 상태 구분 기준
- 어떤 상태 관리 라이브러리를 어떻게 사용할지
- API 연동 방식 (React Query, SWR, 직접 구현 등)
- 상태 저장소 구조 예시

**작성 방법**:
- 상태 관리 라이브러리 선택 이유 (technology-stack.md 참조)
- 전역 상태 항목 나열 (인증 정보, 현재 워크스페이스 등)
- 서버 상태 vs 클라이언트 상태 구분
- 주요 Store 구조 예시 (TypeScript interface)

---

**4. 폴더 구조**
- 프로젝트 루트부터 하위 폴더까지 전체 구조
- 각 폴더의 역할 설명
- 파일 배치 규칙

**작성 방법**:
- Tree 형식으로 전체 구조 표현
- 각 폴더의 목적 간략히 설명
- 주요 파일 예시 포함 (LoginPage.tsx, authStore.ts 등)
- 확장 가능성 고려 (새 페이지/컴포넌트 추가 시 어디에 위치할지 명확히)

---

**선택 포함 내용**:

- **라우팅 전략**: Protected Route, Layout 기반 라우팅 등
- **스타일링 전략**: CSS-in-JS, TailwindCSS 사용 방식
- **타입 정의 전략**: API 응답 타입 정의 위치, 공유 타입 관리
- **에러 처리 전략**: 전역 에러 핸들링, Toast/Modal 사용
- **최적화 전략**: Code Splitting, Lazy Loading 계획

---

**작성 프로세스**:

1. **API 명세 기반 페이지 도출**
   - api-specifications.md의 엔드포인트 확인
   - 각 API에 대응하는 페이지 정의
   - 라우팅 경로 설계

2. **컴포넌트 계층 결정**
   - 컴포넌트 분류 방식 선택 (Atomic Design 등)
   - 재사용 컴포넌트 목록 작성
   - 명명 규칙 정의

3. **상태 관리 설계**
   - 전역 상태 항목 도출 (인증, 현재 선택 항목 등)
   - API 연동 방식 결정 (React Query 등)
   - Store 구조 설계

4. **폴더 구조 정의**
   - 프로젝트 전체 폴더 트리 작성
   - 각 폴더 역할 명시
   - 예시 파일 배치

5. **검토 및 조정**
   - 백엔드 API와 일치하는지 확인
   - 기술 스택과 일관성 있는지 확인
   - 팀원과 합의 (있을 경우)

---

**완료 조건**:
- [ ] 모든 페이지 라우팅 정의 완료
- [ ] 컴포넌트 계층 및 분류 방식 명확화
- [ ] 상태 관리 전략 수립 완료
- [ ] 폴더 구조 전체 정의 완료
- [ ] API 명세와 페이지 매핑 확인

**⚠️ 주의사항**:
1. **과도한 설계 금지**: 모든 컴포넌트를 미리 나열할 필요 없음. 구조와 패턴만 명확히
2. **백엔드 의존성**: API 명세가 확정되지 않으면 페이지 구조 설계 어려움
3. **기술 스택 선행 필요**: technology-stack.md에서 React/Vue, 상태 관리 라이브러리 선정 후 작성
4. **유연성 유지**: 구현 중 구조 변경 가능. 문서는 Git으로 업데이트

---

## 📊 open-questions.md 관리 규칙

### 질문 추가
- 미결정 사항 발생 시 즉시 추가
- 질문 번호 부여 (Q1, Q2, ...)
- 옵션 및 제안 포함

### 질문 해결 시
1. **체크박스 체크** (해당 옵션)
2. **결정 사항 기록** (날짜 포함)
3. **관련 문서 업데이트**:
   - `functional-requirements.md`
   - `bounded-contexts.md`
   - `aggregates.md`
   - 기타 관련 문서
4. **roadmap.md 업데이트**:
   - 추가 작업이 필요하면 TODO 추가
5. **질문 삭제**: 모든 업데이트 완료 후 해당 질문 삭제

### 개발 작업 전 체크
- 새로운 기능/작업 시작 전 `open-questions.md` 확인
- 관련 미결정 사항 있으면 먼저 해결 후 진행

---

## 📊 roadmap.md 업데이트 규칙

**역할**: 프로젝트 전체 진행 상황을 tree 형태로 시각화

**업데이트 시점**: 매 작업 완료 시마다 (필수)

**형태**:
- Tree 구조로 작업 항목 나열
- Checkbox로 완료 여부 표시
- 하위 작업 들여쓰기로 계층 구조 표현

**예시**:
```markdown
- [x] 1단계: 기획
  - [x] PROJECT-OVERVIEW.md 작성
  - [ ] 사용자 승인
- [ ] 2단계: 기능 요구사항
  - [ ] Identity Context
    - [ ] 회원가입 기능 정의
    - [ ] 로그인 기능 정의
  - [ ] Task Context
```

---

**이 규칙은 프로젝트가 진행되면서 함께 업데이트됩니다.**

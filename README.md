# Mermaid Saiko

> Mermaid 다이어그램 실시간 렌더링 & Export 서비스

AI가 생성한 Mermaid 코드를 즉시 시각화하고, 이미지로 변환할 수 있는 웹 기반 서비스입니다.

---

## 주요 기능

- **실시간 렌더링**: 코드 수정 시 자동으로 다이어그램 업데이트 (live preview)
- **이미지 Export**: PNG, SVG 등 다양한 포맷으로 다운로드
- **REST API**: 프로그래밍 방식으로 다이어그램 생성 및 export
- **모든 Mermaid 지원**: 플로우차트, 시퀀스, 클래스, ER 다이어그램 등 모든 타입 지원

---

## 기술 스택

### Backend
- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.3
- **Storage**: In-Memory (일회성 렌더링, 저장 기능 없음)
- **Architecture**: DDD (Domain-Driven Design)

### Frontend
- **Framework**: React 18.3
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.3
- **State Management**: Zustand 5.x
- **Code Editor**: Monaco Editor 4.x
- **Styling**: Tailwind CSS 3.x

### Infrastructure
- **Container**: Docker & Docker Compose
- **Rendering**: Mermaid.js (서버 사이드)
- **Image Export**: Puppeteer (PNG), 직접 변환 (SVG)

---

## 프로젝트 구조

```
mermaid-saiko/
├── backend/                  # NestJS 백엔드
│   ├── src/
│   │   ├── domain/          # Domain Layer (비즈니스 로직)
│   │   ├── application/     # Application Layer (Use Cases)
│   │   ├── infrastructure/  # Infrastructure Layer (DB, External)
│   │   ├── api/             # API Layer (Controllers)
│   │   ├── config/          # Configuration
│   │   └── shared/          # Shared utilities
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── features/        # Feature 기반 모듈
│   │   │   ├── editor/      # 에디터 기능
│   │   │   ├── rendering/   # 렌더링 기능
│   │   │   └── export/      # Export 기능
│   │   ├── shared/          # 공통 컴포넌트
│   │   └── types/           # TypeScript 타입
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── documents/                # 프로젝트 문서 (기획, 설계)
│   ├── planning/
│   ├── requirements/
│   ├── domain-modeling/
│   ├── api/
│   └── architecture/
│
├── docker-compose.yml        # 프로덕션 배포
└── README.md
```

---

## 시작하기

### 사전 요구사항

- **Node.js**: v22+
- **npm**: v10+
- **Docker & Docker Compose**: (선택, 배포용)

**참고**: 이 프로젝트는 데이터베이스를 사용하지 않습니다. 렌더링과 export는 일회성 작업이며, 인메모리 저장소(TTL 1시간)를 사용합니다.

---

### 개발 환경 설정

#### 1. 저장소 클론

```bash
git clone https://github.com/your-username/mermaid-saiko.git
cd mermaid-saiko
```

#### 2. 환경 변수 설정

```bash
# 루트 디렉토리
cp .env.example .env

# 백엔드
cp backend/.env.example backend/.env

# 프론트엔드
cp frontend/.env.example frontend/.env
```

#### 3. 백엔드 의존성 설치 및 실행

```bash
cd backend
npm install
```

**중요**: 처음 실행 시 다음 의존성들이 자동으로 설치됩니다:
- `class-validator`, `class-transformer` (Validation)
- `mermaid`, `puppeteer` (다이어그램 렌더링 & 이미지 변환)

```bash
npm run start:dev
```

백엔드가 `http://localhost:3000`에서 실행됩니다.

**실행 확인**:
```
✅ Server is running on http://localhost:3000
✅ Mapped {/api/v1/rendering/render, POST} route
✅ Mapped {/api/v1/export/png, POST} route
```

#### 4. 프론트엔드 의존성 설치 및 실행

```bash
cd frontend
npm install
```

**중요**: 처음 실행 시 다음 의존성들이 자동으로 설치됩니다:
- `react-router-dom` (라우팅)
- `zustand` (상태 관리)
- `axios` (API 통신)
- `@monaco-editor/react` (코드 에디터)
- `tailwindcss`, `postcss`, `autoprefixer` (스타일링)

```bash
npm run dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

**실행 확인**:
```
VITE v7.1.12  ready in 163 ms
➜  Local:   http://localhost:5173/
```

#### 5. 브라우저에서 접속

```
http://localhost:5173
```

---

### 문제 해결 (Troubleshooting)

#### CORS 에러 발생

브라우저 콘솔에서 CORS 에러가 발생하는 경우:

**원인**: 백엔드가 프론트엔드 origin을 허용하지 않음

**해결책**: `backend/src/main.ts`에서 CORS 설정 확인:
```typescript
app.enableCors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:8080', // Docker nginx
  ],
  credentials: true,
});
```

#### 프론트엔드에서 백엔드 연결 실패 (ERR_CONNECTION_REFUSED)

**원인**: 프론트엔드가 잘못된 URL로 API를 호출

**해결책**:
- Docker 환경: nginx 프록시를 통해 `/api/*` 경로로 요청 (설정 완료됨)
- 개발 환경: `http://localhost:3000`으로 직접 요청

#### TypeScript 컴파일 에러

백엔드 실행 시 TypeScript 에러가 발생하면 `tsconfig.json` 설정을 확인하세요:
- `module: "commonjs"`
- `moduleResolution: "node"`

#### 의존성 설치 에러

```bash
# package-lock.json 삭제 후 재설치
cd backend  # 또는 frontend
rm package-lock.json
rm -rf node_modules
npm install
```

#### Puppeteer 설치 실패 (Linux)

```bash
# Chrome 의존성 설치
sudo apt-get update
sudo apt-get install -y chromium-browser
```

---

### 프로덕션 배포 (Docker Compose)

전체 스택을 Docker Compose로 실행:

#### 1. 환경 변수 설정 (선택사항)

루트 디렉토리에 `.env` 파일을 생성하여 포트 설정 가능:

```bash
# 포트 설정 (선택사항, 기본값 사용 가능)
BACKEND_PORT=3000
FRONTEND_PORT=8080
```

**참고**: 데이터베이스 설정은 필요 없습니다. 인메모리 저장소를 사용합니다.

#### 2. Docker Compose 실행

```bash
# 빌드 및 실행
docker compose up -d --build

# 로그 확인
docker compose logs -f

# 컨테이너 상태 확인
docker compose ps
```

#### 3. 서비스 접근

- **Frontend 웹 UI**: http://localhost:8080
- **Backend API**: http://localhost:3000/api/v1

**주의**:
- 프론트엔드는 **nginx를 통한 프록시**로 백엔드 API에 접근합니다 (`/api/*` 경로)
- 브라우저에서 API를 직접 호출할 필요 없이 프론트엔드 UI만 사용하면 됩니다
- 서버 재시작 시 렌더링 데이터는 모두 초기화됩니다 (인메모리 저장소)

#### 4. 중지 및 재시작

```bash
# 중지
docker compose down

# 재시작
docker compose restart

# 특정 서비스만 재시작
docker compose restart backend
docker compose restart frontend
```

---

## API 사용 예시

### 1. 다이어그램 렌더링

```bash
POST http://localhost:3000/api/v1/rendering/render
Content-Type: application/json

{
  "mermaidCode": "graph LR\n  A[시작] --> B[처리]\n  B --> C[종료]"
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "diagramId": "550e8400-e29b-41d4-a716-446655440000",
    "renderedSvg": "<svg>...</svg>",
    "diagramType": "flowchart"
  }
}
```

### 2. PNG Export

```bash
POST http://localhost:3000/api/v1/export/png
Content-Type: application/json

{
  "mermaidCode": "graph LR\n  A --> B",
  "width": 800,
  "height": 600,
  "backgroundColor": "#ffffff"
}
```

**응답**: PNG 이미지 파일 (binary)

### 3. SVG Export

```bash
POST http://localhost:3000/api/v1/export/svg
Content-Type: application/json

{
  "mermaidCode": "graph LR\n  A --> B"
}
```

**응답**: SVG 파일 (binary)

---

## 개발 가이드

### DDD 레이어드 아키텍처

백엔드는 DDD 원칙에 따라 4개 레이어로 구성:

1. **Domain Layer** (`src/domain/`):
   - 비즈니스 로직의 핵심
   - Aggregate, Entity, Value Object, Domain Event
   - 프레임워크 독립적 (순수 TypeScript)

2. **Application Layer** (`src/application/`):
   - Use Case 구현
   - Command/Query 분리
   - Event Handler

3. **Infrastructure Layer** (`src/infrastructure/`):
   - DB 연동 (TypeORM)
   - 외부 서비스 연동 (Mermaid, Puppeteer)
   - Event Bus

4. **API Layer** (`src/api/`):
   - REST API Controllers
   - Request/Response DTO
   - Validation

### Feature 기반 프론트엔드

프론트엔드는 Bounded Context별로 Feature 모듈 구성:

- `features/editor/`: 코드 에디터 (Monaco Editor)
- `features/rendering/`: 다이어그램 렌더링 및 프리뷰
- `features/export/`: 이미지 export 기능

각 Feature는 독립적인 Zustand 스토어로 상태 관리.

---

## 테스트

### 백엔드 테스트

```bash
cd backend

# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 커버리지
npm run test:cov
```

### 프론트엔드 테스트

```bash
cd frontend

# 단위 테스트
npm run test
```

---

## 문서

프로젝트의 모든 기획/설계 문서는 `documents/` 폴더에 있습니다:

- **`planning/PROJECT-OVERVIEW.md`**: 프로젝트 개요 및 배경
- **`requirements/`**: 기능 요구사항
- **`domain-modeling/`**: Bounded Context, Aggregate, Domain Event 설계
- **`api/`**: API 명세
- **`architecture/`**: 시스템 아키텍처, 기술 스택, DB 설계

---

## 라이선스

MIT

---

## 기여

이슈 및 Pull Request 환영합니다!

---

## 연락처

- GitHub: [your-github](https://github.com/your-username/mermaid-saiko)
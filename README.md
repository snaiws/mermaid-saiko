# Mermaid Saiko

> Mermaid 다이어그램 실시간 렌더링 & Export 서비스 + MCP 통합

AI가 생성한 Mermaid 코드를 즉시 시각화하고, 이미지로 변환할 수 있는 웹 기반 서비스입니다.
**Model Context Protocol (MCP)** 서버를 내장하여 Claude Desktop 등 MCP 클라이언트와 통합 가능합니다.

---

## 주요 기능

- **실시간 렌더링**: 코드 수정 시 자동으로 다이어그램 업데이트 (Ctrl/⌘ + Enter)
- **이미지 Export**: PNG, SVG 등 다양한 포맷으로 다운로드
- **REST API**: 프로그래밍 방식으로 다이어그램 생성 및 export
- **MCP 서버**: Claude Desktop에서 다이어그램을 생성하고 S3에 업로드 (stdio & HTTP/SSE)
- **모든 Mermaid 지원**: 플로우차트, 시퀀스, 클래스, ER 다이어그램 등 모든 타입 지원

---

## 기술 스택

### Monorepo
- **Package Manager**: pnpm workspaces
- **Structure**: packages/ (backend, frontend, shared)

### Backend (@mermaid-saiko/backend)
- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.3
- **Storage**: In-Memory (일회성 렌더링, 저장 기능 없음)
- **Architecture**: DDD (Domain-Driven Design)

### Frontend (@mermaid-saiko/frontend)
- **Framework**: React 18.3
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.3
- **State Management**: Zustand 5.x
- **Code Editor**: Monaco Editor 4.x
- **Styling**: Tailwind CSS 3.x

### Shared (@mermaid-saiko/shared)
- **Mermaid Version**: 11.12.1 (통일)
- **Common Config**: 테마, 폰트, 커스텀 스타일
- **Purpose**: 프론트/백엔드 렌더링 일관성 보장

### Infrastructure
- **Container**: Docker & Docker Compose
- **Rendering**: Mermaid.js 11.12.1 (프론트엔드 & 백엔드)
- **Image Export**: Puppeteer (PNG), 직접 변환 (SVG)
- **MCP Protocol**: @modelcontextprotocol/sdk (stdio & HTTP/SSE)
- **Object Storage**: AWS SDK (S3/MinIO)

---

## 프로젝트 구조 (Monorepo)

```
mermaid-saiko/
├── packages/
│   ├── backend/             # @mermaid-saiko/backend - NestJS 백엔드
│   │   ├── src/
│   │   │   ├── domain/          # Domain Layer (비즈니스 로직)
│   │   │   ├── application/     # Application Layer (Use Cases)
│   │   │   ├── infrastructure/  # Infrastructure Layer (DB, External, S3)
│   │   │   ├── api/             # API Layer (Controllers)
│   │   │   ├── mcp/             # MCP Server (stdio & HTTP/SSE)
│   │   │   ├── config/          # Configuration
│   │   │   └── shared/          # Shared utilities
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── frontend/            # @mermaid-saiko/frontend - React 프론트엔드
│   │   ├── src/
│   │   │   ├── pages/           # 페이지 컴포넌트
│   │   │   ├── features/        # Feature 기반 모듈
│   │   │   │   ├── editor/      # 에디터 기능
│   │   │   │   ├── rendering/   # 렌더링 기능
│   │   │   │   └── export/      # Export 기능
│   │   │   ├── shared/          # 공통 컴포넌트
│   │   │   └── types/           # TypeScript 타입
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   └── package.json
│   │
│   └── shared/              # @mermaid-saiko/shared - 공통 설정
│       ├── src/
│       │   ├── mermaid/
│       │   │   └── config.ts    # Mermaid 공통 설정
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── documents/                # 프로젝트 문서 (기획, 설계)
│   ├── planning/
│   ├── requirements/
│   ├── domain-modeling/
│   ├── api/
│   └── architecture/
│
├── package.json              # 루트 workspace 설정
├── pnpm-workspace.yaml       # pnpm workspace 구성
├── docker-compose.yml        # 프로덕션 배포
└── README.md
```

---

## 시작하기

### 사전 요구사항

- **Node.js**: v18+
- **pnpm**: v8+ (권장 패키지 매니저)
- **Docker & Docker Compose**: (선택, 배포용)

**참고**: 이 프로젝트는 데이터베이스를 사용하지 않습니다. 렌더링과 export는 일회성 작업이며, 인메모리 저장소(TTL 1시간)를 사용합니다.

---

### 개발 환경 설정 (Monorepo)

#### 1. 저장소 클론

```bash
git clone https://github.com/your-username/mermaid-saiko.git
cd mermaid-saiko
```

#### 2. pnpm 설치 (없는 경우)

```bash
npm install -g pnpm
```

#### 3. 환경 변수 설정

```bash
# 루트 디렉토리
cp .env.example .env

# 백엔드
cp packages/backend/.env.example packages/backend/.env

# 프론트엔드
cp packages/frontend/.env.example packages/frontend/.env
```

#### 4. 의존성 설치

```bash
# 루트에서 모든 패키지 의존성 설치
pnpm install
```

이 명령은 다음을 자동으로 수행합니다:
- `packages/shared` - Mermaid 공통 설정
- `packages/backend` - NestJS 백엔드
- `packages/frontend` - React 프론트엔드

#### 5. shared 패키지 빌드

```bash
pnpm build:shared
```

#### 6. 개발 서버 실행

**옵션 1: 모든 서비스 동시 실행**
```bash
pnpm dev
```

**옵션 2: 개별 실행**
```bash
# 백엔드만
pnpm dev:backend

# 프론트엔드만
pnpm dev:frontend
```

**실행 확인**:
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

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

## MCP (Model Context Protocol) 사용법

Mermaid Saiko는 **MCP 서버**를 내장하여 Claude Desktop 같은 AI 도구에서 직접 다이어그램을 생성하고 S3에 업로드할 수 있습니다.

### MCP 기능

- **Tool**: `render_diagram`
  - **입력**: Mermaid 코드
  - **출력**: PNG 이미지 경로/URL
    - **Stdio 모드**: 로컬 파일 절대 경로 (예: `/path/to/storage/diagrams/123-diagram.png`)
    - **HTTP/SSE 모드**: S3 공개 URL (예: `http://localhost:50008/bucket/diagram.png`)
  - **기능**: 다이어그램 렌더링 → PNG 변환 → 저장 → 경로/URL 반환

### 1. Stdio MCP (Claude Desktop)

Claude Desktop에서 사용하는 stdio 기반 MCP 서버입니다. **로컬 파일 시스템에 저장**하고 절대 경로를 반환합니다.

#### 설정 방법

1. **백엔드 빌드**:

```bash
cd backend
npm install
npm run build
```

2. **Claude Desktop 설정** (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "mermaid-saiko": {
      "command": "node",
      "args": ["/absolute/path/to/mermaid-saiko/backend/dist/mcp/mcp.server.js"],
      "env": {
        "MCP_BASE_PATH": "/path/to/your/workspace"
      }
    }
  }
}
```

**중요**:
- `args`의 경로는 반드시 절대 경로여야 합니다
- `MCP_BASE_PATH` (선택사항): 다이어그램 이미지를 저장할 기본 경로
  - 설정하지 않으면 MCP 서버가 실행된 디렉토리를 사용합니다
  - 설정 시 해당 경로 아래 `storage/diagrams/` 폴더에 저장됩니다
  - Claude Desktop이 접근 가능한 경로여야 합니다

**예시**:
- Mac:
  - args: `"/Users/yourname/Projects/mermaid-saiko/backend/dist/mcp/mcp.server.js"`
  - MCP_BASE_PATH: `"/Users/yourname/Documents"` (선택사항)
- Linux:
  - args: `"/home/yourname/Projects/mermaid-saiko/backend/dist/mcp/mcp.server.js"`
  - MCP_BASE_PATH: `"/home/yourname/workspace"` (선택사항)
- Windows:
  - args: `"C:\\Users\\yourname\\Projects\\mermaid-saiko\\backend\\dist\\mcp\\mcp.server.js"`
  - MCP_BASE_PATH: `"C:\\Users\\yourname\\Documents"` (선택사항)

3. **Claude Desktop 재시작**

이제 Claude Desktop에서 Mermaid 코드를 작성하면 자동으로 이미지를 생성하고 **로컬 파일 경로**를 반환합니다.

#### 사용 예시 (Claude Desktop)

```
You: "Create a flowchart showing user authentication process"

Claude: [Uses render_diagram tool]
Input:
{
  "mermaidCode": "flowchart TD\n  A[User Login] --> B{Valid?}\n  B -->|Yes| C[Success]\n  B -->|No| D[Error]"
}

Output:
{
  "success": true,
  "imageUrl": "/absolute/path/to/storage/diagrams/1699876543210-diagram.png",
  "diagramType": "flowchart"
}
```

**저장 위치**:
- `MCP_BASE_PATH`를 설정한 경우: `{MCP_BASE_PATH}/storage/diagrams/`
- 설정하지 않은 경우: `{MCP_SERVER_DIR}/storage/diagrams/`

생성된 이미지는 설정된 경로에 저장되며, Claude Desktop이 해당 파일을 직접 읽을 수 있습니다.

### 2. HTTP/SSE MCP (Web Clients)

HTTP와 Server-Sent Events를 사용하는 MCP 서버입니다. **S3/MinIO에 업로드**하고 공개 URL을 반환합니다.

#### 사전 요구사항

HTTP/SSE 모드를 사용하려면 S3/MinIO가 필요합니다. 아래 "S3/MinIO 설정" 섹션을 먼저 완료하세요.

#### 엔드포인트

- **SSE 연결**: `GET http://localhost:3000/mcp/sse`
- **메시지 전송**: `POST http://localhost:3000/mcp/message`

#### 사용 예시

```javascript
// SSE 연결
const eventSource = new EventSource('http://localhost:3000/mcp/sse');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'connected') {
    sessionId = data.sessionId;
  } else {
    console.log('Response:', data);
  }
};

// 다이어그램 렌더링 요청
fetch('http://localhost:3000/mcp/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-session-id': sessionId
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'render_diagram',
      arguments: {
        mermaidCode: 'graph LR\n  A --> B'
      }
    }
  })
});

// 응답 예시
{
  "success": true,
  "imageUrl": "http://localhost:50008/mermaid-diagrams/abc123-diagram.png",
  "diagramType": "flowchart"
}
```

### S3/MinIO 설정

HTTP/SSE MCP 모드는 MinIO를 사용하여 이미지를 저장합니다. (Stdio 모드는 S3 불필요)

#### MinIO 실행 (Docker)

```bash
docker run -d \
  -p 50008:9000 \
  -p 50009:9001 \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=password \
  --name minio \
  minio/minio server /data --console-address ":9001"
```

#### 버킷 생성

1. MinIO Console 접속: `http://localhost:50009`
2. 로그인: `admin` / `password`
3. **Buckets** → **Create Bucket** → 이름: `mermaid-diagrams`
4. **Access Policy** → `public` (다운로드 가능하도록)

### 아키텍처

MCP 서버는 **기존 Use Case를 재사용**하여 DDD 아키텍처를 유지합니다:

```
MCP Layer (Interface)
    ↓
RenderDiagramTool
    ↓
ExportPngUseCase (Application Layer)
    ↓
MermaidRenderer + ImageConverter (Infrastructure)
    ↓
S3Service → MinIO
```

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
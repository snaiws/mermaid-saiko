# API Layer

**역할**: HTTP 인터페이스 제공 (REST API)

**포함 내용**:
- Controllers (NestJS)
- Request/Response DTO
- Validation
- Middleware
- Error Handling

**의존성**:
- Application Layer 호출
- Domain/Infrastructure Layer 직접 참조 금지

**폴더 구조**:
```
api/
├─ controllers/   # REST API Controllers
├─ dto/           # Request/Response DTO
└─ middleware/    # 미들웨어
```

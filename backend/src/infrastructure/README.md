# Infrastructure Layer

**역할**: 외부 시스템 연동 및 기술적 구현

**포함 내용**:
- Repository 구현
- Database 연동 (TypeORM)
- Event Bus 구현
- 외부 서비스 연동 (Mermaid, Puppeteer)
- 파일 시스템 I/O

**의존성**:
- Domain Layer 인터페이스 구현
- Application Layer에서 주입됨 (DI)

**폴더 구조**:
```
infrastructure/
├─ persistence/   # Repository, TypeORM Entities
├─ messaging/     # Event Bus
└─ external/      # Mermaid, Puppeteer 등
```

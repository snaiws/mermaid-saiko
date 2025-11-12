# Application Layer

**역할**: Use Case 구현 및 도메인 로직 조율

**포함 내용**:
- Use Case (Command/Query)
- Application Service
- Event Handler
- DTO (Application 레벨)

**의존성**:
- Domain Layer 참조 가능
- Infrastructure Layer 인터페이스만 참조 (구현체 X)

**폴더 구조**:
```
application/
├─ use-cases/     # Use Case 구현
└─ events/        # Event Handler
```

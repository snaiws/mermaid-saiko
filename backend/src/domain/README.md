# Domain Layer

**역할**: 비즈니스 로직의 핵심. 프레임워크에 독립적인 순수 TypeScript 코드

**포함 내용**:
- Aggregate Root
- Entity
- Value Object
- Domain Event (인터페이스)
- 비즈니스 규칙 (Invariants)

**금지 사항**:
- NestJS 데코레이터 사용 금지
- 외부 라이브러리 의존성 최소화
- Infrastructure Layer 참조 금지

**폴더 구조**:
```
domain/
├─ editor/        # Editor Context
├─ rendering/     # Rendering Context
└─ export/        # Export Context
```

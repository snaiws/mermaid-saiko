# 이벤트 기반 설계

> 📋 **문서 목적**: Mermaid Saiko 프로젝트의 이벤트 기반 아키텍처 설계

**마지막 업데이트**: 2025-10-26

---

## 현재 상태 (Phase 1+2)

**이벤트 사용 최소화** - 간단한 in-process 이벤트만 사용

### 이유
- Context 간 통신이 단순함 (Editor → Rendering → Export)
- 비동기 처리 불필요 (모든 작업이 동기식)
- 복잡도 최소화 우선

---

## 이벤트 플로우

### 1. 웹 에디터 플로우 (동기)

```
[User] → 코드 입력
   ↓
[EditorSession] → 디바운싱 (300ms)
   ↓
[RenderDiagramUseCase] → Diagram.create()
   ↓
[Diagram] → render()
   ↓ (이벤트 발행: DiagramRendered)
[Frontend] ← SVG 반환
```

**특징**: 모두 동기 호출, 이벤트는 로깅용으로만 사용

---

### 2. API 렌더링 플로우 (동기)

```
[Client] → POST /api/v1/rendering/render
   ↓
[RenderingController] → RenderDiagramUseCase
   ↓
[Diagram] → create() & render()
   ↓ (이벤트 발행: DiagramRendered)
[Repository] → save (인메모리)
   ↓
[Client] ← JSON 응답
```

**특징**: 동기 처리, 이벤트는 선택적

---

### 3. Export 플로우 (동기)

```
[Client] → POST /api/v1/export/png
   ↓
[ExportController] → ExportImageUseCase
   ↓
[Diagram] → render()
   ↓
[DiagramImage] → create() & export()
   ↓ (Puppeteer 호출)
[DiagramImage] ← PNG 데이터
   ↓ (이벤트 발행: ImageExported)
[Client] ← PNG 바이너리
```

**특징**: Puppeteer 호출은 동기적, 이벤트는 로깅용

---

## Domain Events

### Rendering Context

| 이벤트명 | 발행 시점 | 페이로드 | 구독자 |
|---------|----------|---------|--------|
| DiagramCreated | Diagram 생성 시 | diagramId, mermaidCode, diagramType | 없음 (로깅만) |
| DiagramRendered | 렌더링 성공 시 | diagramId, renderedSvg | 없음 (로깅만) |
| DiagramRenderFailed | 렌더링 실패 시 | diagramId, errorMessage | 없음 (로깅만) |
| DiagramCodeUpdated | 코드 업데이트 시 | diagramId, oldCode, newCode | 없음 (로깅만) |

---

### Export Context

| 이벤트명 | 발행 시점 | 페이로드 | 구독자 |
|---------|----------|---------|--------|
| ImageExportRequested | Export 요청 시 | imageId, format | 없음 (로깅만) |
| ImageExported | Export 성공 시 | imageId, format, fileSize | 없음 (로깅만) |
| ImageExportFailed | Export 실패 시 | imageId, errorMessage | 없음 (로깅만) |
| ImageResized | 크기 조정 시 | imageId, newWidth, newHeight | 없음 (로깅만) |

---

### Editor Context

| 이벤트명 | 발행 시점 | 페이로드 | 구독자 |
|---------|----------|---------|--------|
| EditorSessionStarted | 세션 시작 시 | sessionId | 없음 (로깅만) |
| CodeChanged | 코드 변경 시 | sessionId, newCode | 없음 (로깅만) |
| RenderRequested | 디바운싱 후 | sessionId, mermaidCode | Rendering Context (직접 호출) |

**참고**: RenderRequested는 실제로는 직접 함수 호출로 처리됨 (이벤트 불필요)

---

## Event Bus 구현

### Phase 1+2: 간단한 In-Process Event Emitter

```typescript
// Infrastructure Layer
class InProcessEventBus {
  private emitter = new EventEmitter();

  publish(event: DomainEvent): void {
    this.emitter.emit(event.eventName, event);
    console.log(`[Event Published] ${event.eventName}`, event);
  }

  subscribe(eventName: string, handler: (event: DomainEvent) => void): void {
    this.emitter.on(eventName, handler);
  }
}
```

**특징**:
- 단일 프로세스 내에서만 동작
- 로깅 및 모니터링 목적
- 비즈니스 로직에 영향 없음 (Fire and Forget)

---

### Phase 3: Redis Pub/Sub (향후)

만약 마이크로서비스로 분리하거나 분산 시스템이 필요하면:

```typescript
class RedisPubSubEventBus {
  constructor(private redis: Redis) {}

  async publish(event: DomainEvent): Promise<void> {
    await this.redis.publish(
      event.eventName,
      JSON.stringify(event)
    );
  }

  subscribe(eventName: string, handler: (event: DomainEvent) => void): void {
    this.redis.subscribe(eventName, (channel, message) => {
      const event = JSON.parse(message);
      handler(event);
    });
  }
}
```

**현재는 불필요**: 단일 서버로 충분

---

## 이벤트 vs 직접 호출

### 직접 호출 (현재 Phase 1+2)

```typescript
// Application Layer
class RenderDiagramUseCase {
  async execute(mermaidCode: string): Promise<DiagramDto> {
    const diagram = Diagram.create(mermaidCode);
    diagram.render(); // 동기 호출

    await this.repository.save(diagram);

    // 이벤트 발행 (선택적, 로깅용)
    this.eventBus.publish(new DiagramRendered(diagram));

    return DiagramDto.from(diagram);
  }
}
```

**장점**:
- 간단하고 명확
- 디버깅 쉬움
- 성능 좋음 (오버헤드 없음)

**단점**:
- Context 간 결합도 증가
- 향후 비동기 처리 전환 어려움

---

### 이벤트 기반 (Phase 3 고려)

```typescript
// Application Layer
class RenderDiagramUseCase {
  async execute(mermaidCode: string): Promise<DiagramDto> {
    const diagram = Diagram.create(mermaidCode);
    diagram.render();

    await this.repository.save(diagram);

    // 이벤트 발행 (비즈니스 로직)
    await this.eventBus.publish(new DiagramRendered(diagram));

    return DiagramDto.from(diagram);
  }
}

// Event Handler (다른 Context에서 구독)
class DiagramRenderedHandler {
  async handle(event: DiagramRendered): Promise<void> {
    // Export Context에서 자동 이미지 생성 등
    // 또는 Notification Context에서 알림 발송
  }
}
```

**장점**:
- Context 간 결합도 감소
- 확장성 높음
- 비동기 처리 가능

**단점**:
- 복잡도 증가
- 디버깅 어려움
- 이벤트 순서 보장 필요

---

## Context 간 통신

### 현재 (Phase 1+2): 직접 호출

```
Editor (Frontend)
   ↓ HTTP
Rendering API
   ↓ 직접 호출
Rendering UseCase
   ↓ 직접 호출
Diagram Aggregate
```

**이벤트는 로깅/모니터링 목적만**

---

### 향후 (Phase 3): 이벤트 + 직접 호출 혼합

```
Editor (Frontend)
   ↓ HTTP
Rendering API
   ↓ 직접 호출
Rendering UseCase
   ↓ 이벤트 발행
DiagramRendered → Export Context (비동기 자동 생성)
                → Notification Context (알림)
                → Analytics Context (분석)
```

**이벤트로 확장성 확보**

---

## 이벤트 저장소 (Event Store)

### Phase 1+2: 불필요

이벤트는 로깅만 하고 저장하지 않음

### Phase 3: Event Sourcing 고려

만약 Event Sourcing을 도입한다면:
- 모든 이벤트를 DB에 저장
- Aggregate 상태를 이벤트로부터 재구성
- 시간 여행 디버깅 가능

**현재는 오버스펙**

---

## 승인 상태

**전체 승인 상태**: ✅ (승인 완료 - 2025-10-26)

**승인 체크리스트**:
- [x] Phase 1+2 이벤트 최소화 전략 승인
- [x] In-Process Event Bus 승인
- [x] 직접 호출 방식 승인
- [x] Phase 3 확장 계획 승인

---

> 📎 **관련 문서**:
> - `documents/domain-modeling/rendering/events.md`
> - `documents/domain-modeling/export/events.md`
> - `documents/domain-modeling/editor/events.md`
> - `documents/architecture/system-overview.md`

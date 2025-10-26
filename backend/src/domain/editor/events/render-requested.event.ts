import { DomainEvent } from '../../shared/domain-event.interface';

/**
 * 렌더링 요청 이벤트
 */
export class RenderRequestedEvent implements DomainEvent {
  readonly eventType = 'RenderRequested';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly mermaidCode: string,
  ) {}
}

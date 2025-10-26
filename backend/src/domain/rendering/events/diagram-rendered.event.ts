import { DomainEvent } from '../../shared/domain-event.interface';

/**
 * Diagram 렌더링 성공 이벤트
 */
export class DiagramRenderedEvent implements DomainEvent {
  readonly eventType = 'DiagramRendered';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly renderedSvg: string,
  ) {}
}

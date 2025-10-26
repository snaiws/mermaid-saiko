import { DomainEvent } from '../../shared/domain-event.interface';

/**
 * Diagram 렌더링 실패 이벤트
 */
export class DiagramRenderFailedEvent implements DomainEvent {
  readonly eventType = 'DiagramRenderFailed';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly errorMessage: string,
    public readonly errorLine: number | null,
    public readonly errorColumn: number | null,
  ) {}
}

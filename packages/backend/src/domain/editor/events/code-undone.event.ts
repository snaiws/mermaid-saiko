import { DomainEvent } from '../../shared/domain-event.interface';

/**
 * 코드 되돌리기 이벤트
 */
export class CodeUndoneEvent implements DomainEvent {
  readonly eventType = 'CodeUndone';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly restoredCode: string,
  ) {}
}

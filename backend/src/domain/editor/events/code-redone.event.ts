import { DomainEvent } from '../../shared/domain-event.interface';

/**
 * 코드 다시 실행 이벤트
 */
export class CodeRedoneEvent implements DomainEvent {
  readonly eventType = 'CodeRedone';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly restoredCode: string,
  ) {}
}

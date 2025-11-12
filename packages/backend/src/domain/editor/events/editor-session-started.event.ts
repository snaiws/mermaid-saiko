import { DomainEvent } from '../../shared/domain-event.interface';

/**
 * 에디터 세션 시작 이벤트
 */
export class EditorSessionStartedEvent implements DomainEvent {
  readonly eventType = 'EditorSessionStarted';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
  ) {}
}

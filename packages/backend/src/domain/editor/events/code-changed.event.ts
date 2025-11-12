import { DomainEvent } from '../../shared/domain-event.interface';

/**
 * 코드 변경 이벤트
 */
export class CodeChangedEvent implements DomainEvent {
  readonly eventType = 'CodeChanged';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly newCode: string,
    public readonly cursorLine: number,
    public readonly cursorColumn: number,
  ) {}
}

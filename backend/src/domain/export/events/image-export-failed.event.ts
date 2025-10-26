import { DomainEvent } from '../../shared/domain-event.interface';

/**
 * 이미지 Export 실패 이벤트
 */
export class ImageExportFailedEvent implements DomainEvent {
  readonly eventType = 'ImageExportFailed';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly errorMessage: string,
  ) {}
}

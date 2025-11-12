import { DomainEvent } from '../../shared/domain-event.interface';

/**
 * 이미지 크기 조정 이벤트
 */
export class ImageResizedEvent implements DomainEvent {
  readonly eventType = 'ImageResized';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly newWidth: number,
    public readonly newHeight: number,
  ) {}
}

import { DomainEvent } from '../../shared/domain-event.interface';
import { ImageFormat } from '../image-format.enum';

/**
 * 이미지 Export 성공 이벤트
 */
export class ImageExportedEvent implements DomainEvent {
  readonly eventType = 'ImageExported';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly format: ImageFormat,
    public readonly fileSize: number,
  ) {}
}

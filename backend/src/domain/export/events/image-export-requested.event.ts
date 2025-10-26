import { DomainEvent } from '../../shared/domain-event.interface';
import { ImageFormat } from '../image-format.enum';

/**
 * 이미지 Export 요청 이벤트
 */
export class ImageExportRequestedEvent implements DomainEvent {
  readonly eventType = 'ImageExportRequested';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly format: ImageFormat,
    public readonly width: number | null,
    public readonly height: number | null,
  ) {}
}

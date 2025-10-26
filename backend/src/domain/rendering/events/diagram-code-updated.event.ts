import { DomainEvent } from '../../shared/domain-event.interface';
import { DiagramType } from '../diagram-type.enum';

/**
 * Diagram 코드 업데이트 이벤트
 */
export class DiagramCodeUpdatedEvent implements DomainEvent {
  readonly eventType = 'DiagramCodeUpdated';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly newMermaidCode: string,
    public readonly newDiagramType: DiagramType,
  ) {}
}

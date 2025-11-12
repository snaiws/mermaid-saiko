import { DomainEvent } from '../../shared/domain-event.interface';
import { DiagramType } from '../diagram-type.enum';

/**
 * Diagram 생성 이벤트
 */
export class DiagramCreatedEvent implements DomainEvent {
  readonly eventType = 'DiagramCreated';

  constructor(
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly aggregateId: string,
    public readonly mermaidCode: string,
    public readonly diagramType: DiagramType,
  ) {}
}

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from '../../domain/shared/domain-event.interface';

/**
 * Domain Event Publisher
 *
 * Domain Event를 NestJS EventEmitter로 발행
 */
@Injectable()
export class DomainEventPublisherService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * 단일 Domain Event 발행
   */
  publish(event: DomainEvent): void {
    this.eventEmitter.emit(event.eventType, event);
  }

  /**
   * 여러 Domain Events 발행
   */
  publishAll(events: DomainEvent[]): void {
    events.forEach((event) => this.publish(event));
  }
}

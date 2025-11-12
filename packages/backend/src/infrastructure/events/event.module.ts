import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DomainEventPublisherService } from './domain-event-publisher.service';

/**
 * Event Module
 *
 * NestJS EventEmitter 기반 Event Bus 설정
 */
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
  ],
  providers: [DomainEventPublisherService],
  exports: [DomainEventPublisherService],
})
export class EventModule {}

import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { EventModule } from './events/event.module';
import {
  MermaidPuppeteerRendererService,
  ImagePuppeteerConverterService,
} from './services';

/**
 * Infrastructure Module
 *
 * Infrastructure Layer의 모든 구현체를 통합
 */
@Module({
  imports: [PersistenceModule, EventModule],
  providers: [
    MermaidPuppeteerRendererService,
    ImagePuppeteerConverterService,
  ],
  exports: [
    PersistenceModule,
    EventModule,
    MermaidPuppeteerRendererService,
    ImagePuppeteerConverterService,
  ],
})
export class InfrastructureModule {}

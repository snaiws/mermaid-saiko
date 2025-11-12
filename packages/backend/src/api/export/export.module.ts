import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportPngUseCase } from '../../application/use-cases/export/export-png.use-case';
import { ExportSvgUseCase } from '../../application/use-cases/export/export-svg.use-case';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { InMemoryDiagramImageRepository } from '../../infrastructure/persistence/memory/repositories/in-memory-diagram-image.repository';
import { MermaidPuppeteerRendererService } from '../../infrastructure/services/mermaid-puppeteer-renderer.service';
import { ImagePuppeteerConverterService } from '../../infrastructure/services/image-puppeteer-converter.service';
import { DomainEventPublisherService } from '../../infrastructure/events/domain-event-publisher.service';

@Module({
  imports: [InfrastructureModule],
  controllers: [ExportController],
  providers: [
    {
      provide: ExportPngUseCase,
      useFactory: (
        diagramImageRepository: InMemoryDiagramImageRepository,
        mermaidRenderer: MermaidPuppeteerRendererService,
        imageConverter: ImagePuppeteerConverterService,
        eventPublisher: DomainEventPublisherService,
      ) => {
        return new ExportPngUseCase(
          diagramImageRepository,
          mermaidRenderer,
          imageConverter,
          eventPublisher,
        );
      },
      inject: [
        InMemoryDiagramImageRepository,
        MermaidPuppeteerRendererService,
        ImagePuppeteerConverterService,
        DomainEventPublisherService,
      ],
    },
    {
      provide: ExportSvgUseCase,
      useFactory: (
        diagramImageRepository: InMemoryDiagramImageRepository,
        mermaidRenderer: MermaidPuppeteerRendererService,
        imageConverter: ImagePuppeteerConverterService,
        eventPublisher: DomainEventPublisherService,
      ) => {
        return new ExportSvgUseCase(
          diagramImageRepository,
          mermaidRenderer,
          imageConverter,
          eventPublisher,
        );
      },
      inject: [
        InMemoryDiagramImageRepository,
        MermaidPuppeteerRendererService,
        ImagePuppeteerConverterService,
        DomainEventPublisherService,
      ],
    },
  ],
})
export class ExportModule {}

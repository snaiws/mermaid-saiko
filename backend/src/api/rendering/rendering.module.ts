import { Module } from '@nestjs/common';
import { RenderingController } from './rendering.controller';
import { RenderDiagramUseCase } from '../../application/use-cases/rendering/render-diagram.use-case';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { TypeOrmDiagramRepository } from '../../infrastructure/persistence/typeorm/repositories/typeorm-diagram.repository';
import { MermaidPuppeteerRendererService } from '../../infrastructure/services/mermaid-puppeteer-renderer.service';
import { DomainEventPublisherService } from '../../infrastructure/events/domain-event-publisher.service';

@Module({
  imports: [InfrastructureModule],
  controllers: [RenderingController],
  providers: [
    {
      provide: RenderDiagramUseCase,
      useFactory: (
        diagramRepository: TypeOrmDiagramRepository,
        mermaidRenderer: MermaidPuppeteerRendererService,
        eventPublisher: DomainEventPublisherService,
      ) => {
        return new RenderDiagramUseCase(
          diagramRepository,
          mermaidRenderer,
          eventPublisher,
        );
      },
      inject: [
        TypeOrmDiagramRepository,
        MermaidPuppeteerRendererService,
        DomainEventPublisherService,
      ],
    },
    // Repository는 Controller에서 직접 사용
    TypeOrmDiagramRepository,
  ],
})
export class RenderingModule {}

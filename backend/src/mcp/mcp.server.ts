import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { RenderDiagramTool } from './tools/render-diagram.tool';
import { ExportPngUseCase } from '../application/use-cases/export/export-png.use-case';
import { S3Service } from '../infrastructure/storage/s3.service';
import { InMemoryDiagramImageRepository } from '../infrastructure/persistence/memory/repositories/in-memory-diagram-image.repository';
import { MermaidPuppeteerRendererService } from '../infrastructure/services/mermaid-puppeteer-renderer.service';
import { ImagePuppeteerConverterService } from '../infrastructure/services/image-puppeteer-converter.service';
import { DomainEventPublisherService } from '../infrastructure/events/domain-event-publisher.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * MCP Server for Mermaid Diagram Rendering
 * stdio 통신을 사용하여 Claude Desktop과 통합
 */
export class MermaidMcpServer {
  private server: Server;
  private renderDiagramTool: RenderDiagramTool;
  private mermaidRenderer: MermaidPuppeteerRendererService;
  private imageConverter: ImagePuppeteerConverterService;

  constructor() {
    // Dependencies 생성
    this.mermaidRenderer = new MermaidPuppeteerRendererService();
    this.imageConverter = new ImagePuppeteerConverterService();

    const diagramImageRepository = new InMemoryDiagramImageRepository();
    const eventEmitter = new EventEmitter2();
    const eventPublisher = new DomainEventPublisherService(eventEmitter);
    const s3Service = new S3Service();

    const exportPngUseCase = new ExportPngUseCase(
      diagramImageRepository,
      this.mermaidRenderer,
      this.imageConverter,
      eventPublisher,
    );

    this.renderDiagramTool = new RenderDiagramTool(exportPngUseCase, s3Service);

    // MCP Server 초기화
    this.server = new Server(
      {
        name: 'mermaid-diagram-renderer',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // Tools 목록 반환
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'render_diagram',
          description:
            'Renders a Mermaid diagram and returns a PNG image file path (local storage)',
          inputSchema: {
            type: 'object',
            properties: {
              mermaidCode: {
                type: 'string',
                description: 'The Mermaid diagram code to render',
              },
            },
            required: ['mermaidCode'],
          },
        },
      ],
    }));

    // Tool 실행
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'render_diagram') {
        const result = await this.renderDiagramTool.execute({
          ...(request.params.arguments as any),
          useLocalStorage: true, // stdio 모드는 항상 로컬 저장
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      throw new Error(`Unknown tool: ${request.params.name}`);
    });
  }

  async start() {
    // Puppeteer 초기화
    await this.mermaidRenderer.onModuleInit();
    await this.imageConverter.onModuleInit();

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Mermaid MCP Server running on stdio');
  }

  async stop() {
    // Puppeteer 정리
    await this.mermaidRenderer.onModuleDestroy();
    await this.imageConverter.onModuleDestroy();
  }
}

// 실행
if (require.main === module) {
  const server = new MermaidMcpServer();
  server.start().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.error('Received SIGINT, shutting down gracefully');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.error('Received SIGTERM, shutting down gracefully');
    await server.stop();
    process.exit(0);
  });
}

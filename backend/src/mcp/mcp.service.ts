import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Observable, Subject } from 'rxjs';
import { RenderDiagramTool } from './tools/render-diagram.tool';
import { ExportPngUseCase } from '../application/use-cases/export/export-png.use-case';
import { S3Service } from '../infrastructure/storage/s3.service';
import { InMemoryDiagramImageRepository } from '../infrastructure/persistence/memory/repositories/in-memory-diagram-image.repository';
import { MermaidPuppeteerRendererService } from '../infrastructure/services/mermaid-puppeteer-renderer.service';
import { ImagePuppeteerConverterService } from '../infrastructure/services/image-puppeteer-converter.service';
import { DomainEventPublisherService } from '../infrastructure/events/domain-event-publisher.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@Injectable()
export class McpService implements OnModuleInit, OnModuleDestroy {
  private server: Server;
  private renderDiagramTool: RenderDiagramTool;
  private mermaidRenderer: MermaidPuppeteerRendererService;
  private imageConverter: ImagePuppeteerConverterService;
  private messageSubjects: Map<string, Subject<MessageEvent>> = new Map();

  async onModuleInit() {
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

    // Puppeteer 초기화
    await this.mermaidRenderer.onModuleInit();
    await this.imageConverter.onModuleInit();

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

  async onModuleDestroy() {
    // Puppeteer 정리
    await this.mermaidRenderer?.onModuleDestroy();
    await this.imageConverter?.onModuleDestroy();

    // Subject 정리
    this.messageSubjects.forEach((subject) => subject.complete());
    this.messageSubjects.clear();
  }

  private setupHandlers() {
    // Tools 목록 반환
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'render_diagram',
          description:
            'Renders a Mermaid diagram and returns a PNG image URL from S3',
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
        const result = await this.renderDiagramTool.execute(
          request.params.arguments as any,
        );

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

  /**
   * SSE 스트림 생성
   */
  createSseStream(): Observable<MessageEvent> {
    const sessionId = Math.random().toString(36).substring(7);
    const subject = new Subject<MessageEvent>();
    this.messageSubjects.set(sessionId, subject);

    // 초기 연결 메시지
    subject.next({
      data: JSON.stringify({ type: 'connected', sessionId }),
      id: Date.now().toString(),
    });

    return subject.asObservable();
  }

  /**
   * 클라이언트 메시지 처리
   */
  async handleMessage(message: any, sessionId: string) {
    try {
      // MCP 프로토콜에 따라 메시지 처리
      const result = await this.processMessage(message);

      // SSE를 통해 응답 전송
      const subject = this.messageSubjects.get(sessionId);
      if (subject) {
        subject.next({
          data: JSON.stringify(result),
          id: Date.now().toString(),
        });
      }

      return result;
    } catch (error) {
      const errorResponse = {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };

      const subject = this.messageSubjects.get(sessionId);
      if (subject) {
        subject.next({
          data: JSON.stringify(errorResponse),
          id: Date.now().toString(),
        });
      }

      return errorResponse;
    }
  }

  /**
   * MCP 메시지 처리
   */
  private async processMessage(message: any) {
    const { method, params } = message;

    switch (method) {
      case 'tools/list':
        return {
          tools: [
            {
              name: 'render_diagram',
              description:
                'Renders a Mermaid diagram and returns a PNG image URL from S3',
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
        };

      case 'tools/call':
        if (params.name === 'render_diagram') {
          const result = await this.renderDiagramTool.execute(params.arguments);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        throw new Error(`Unknown tool: ${params.name}`);

      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }
}

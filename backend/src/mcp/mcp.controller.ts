import { Controller, Post, Sse, Body, Headers } from '@nestjs/common';
import { Observable } from 'rxjs';
import { McpService } from './mcp.service';

interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@Controller('mcp')
export class McpController {
  constructor(private readonly mcpService: McpService) {}

  /**
   * SSE endpoint for MCP communication
   */
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.mcpService.createSseStream();
  }

  /**
   * POST endpoint for sending messages to MCP server
   */
  @Post('message')
  async handleMessage(
    @Body() body: any,
    @Headers('x-session-id') sessionId: string,
  ) {
    return this.mcpService.handleMessage(body, sessionId);
  }
}

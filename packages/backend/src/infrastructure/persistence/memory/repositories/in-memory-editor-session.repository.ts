import { Injectable } from '@nestjs/common';
import { EditorSession } from '../../../../domain/editor/editor-session.aggregate';
import { IEditorSessionRepository } from '../../../../domain/editor/editor-session.repository.interface';

/**
 * 인메모리 EditorSession Repository 구현
 *
 * Phase 1+2: 에디터는 클라이언트 사이드에서 관리
 * - Map 기반 인메모리 저장
 * - TTL 24시간 (비활성 세션 정리)
 * - 서버 재시작 시 데이터 손실 (의도된 동작)
 *
 * 참고: Phase 1+2에서는 실제로 사용되지 않을 수 있음
 */
@Injectable()
export class InMemoryEditorSessionRepository implements IEditorSessionRepository {
  private readonly sessions: Map<string, { session: EditorSession; expiresAt: number }> = new Map();
  private readonly TTL_MS = 24 * 60 * 60 * 1000; // 24시간

  constructor() {
    // 5분마다 만료된 항목 정리
    setInterval(() => this.cleanupExpired(), 5 * 60 * 1000);
  }

  async save(session: EditorSession): Promise<void> {
    const expiresAt = Date.now() + this.TTL_MS;
    this.sessions.set(session.id, { session, expiresAt });
  }

  async findById(id: string): Promise<EditorSession | null> {
    const entry = this.sessions.get(id);

    if (!entry) {
      return null;
    }

    // 만료된 경우 삭제하고 null 반환
    if (Date.now() > entry.expiresAt) {
      this.sessions.delete(id);
      return null;
    }

    return entry.session;
  }

  async delete(id: string): Promise<void> {
    this.sessions.delete(id);
  }

  /**
   * 만료된 항목 정리
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const expiredIds: string[] = [];

    for (const [id, entry] of this.sessions.entries()) {
      if (now > entry.expiresAt) {
        expiredIds.push(id);
      }
    }

    expiredIds.forEach((id) => this.sessions.delete(id));

    if (expiredIds.length > 0) {
      console.log(`[InMemoryEditorSessionRepository] Cleaned up ${expiredIds.length} expired sessions`);
    }
  }

  /**
   * 테스트용: 저장된 항목 수 반환
   */
  getSize(): number {
    return this.sessions.size;
  }
}

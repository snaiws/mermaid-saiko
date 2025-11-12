import { Injectable } from '@nestjs/common';
import { Diagram } from '../../../../domain/rendering/diagram.aggregate';
import { IDiagramRepository } from '../../../../domain/rendering/diagram.repository.interface';

/**
 * 인메모리 Diagram Repository 구현
 *
 * Phase 1+2: 저장 기능 제외, 렌더링은 일회성 작업
 * - Map 기반 인메모리 저장
 * - TTL 1시간 (메모리 관리)
 * - 서버 재시작 시 데이터 손실 (의도된 동작)
 */
@Injectable()
export class InMemoryDiagramRepository implements IDiagramRepository {
  private readonly diagrams: Map<string, { diagram: Diagram; expiresAt: number }> = new Map();
  private readonly TTL_MS = 60 * 60 * 1000; // 1시간

  constructor() {
    // 1분마다 만료된 항목 정리
    setInterval(() => this.cleanupExpired(), 60 * 1000);
  }

  async save(diagram: Diagram): Promise<void> {
    const expiresAt = Date.now() + this.TTL_MS;
    this.diagrams.set(diagram.id, { diagram, expiresAt });
  }

  async findById(id: string): Promise<Diagram | null> {
    const entry = this.diagrams.get(id);

    if (!entry) {
      return null;
    }

    // 만료된 경우 삭제하고 null 반환
    if (Date.now() > entry.expiresAt) {
      this.diagrams.delete(id);
      return null;
    }

    return entry.diagram;
  }

  async delete(id: string): Promise<void> {
    this.diagrams.delete(id);
  }

  /**
   * 만료된 항목 정리
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const expiredIds: string[] = [];

    for (const [id, entry] of this.diagrams.entries()) {
      if (now > entry.expiresAt) {
        expiredIds.push(id);
      }
    }

    expiredIds.forEach((id) => this.diagrams.delete(id));

    if (expiredIds.length > 0) {
      console.log(`[InMemoryDiagramRepository] Cleaned up ${expiredIds.length} expired diagrams`);
    }
  }

  /**
   * 테스트용: 저장된 항목 수 반환
   */
  getSize(): number {
    return this.diagrams.size;
  }
}

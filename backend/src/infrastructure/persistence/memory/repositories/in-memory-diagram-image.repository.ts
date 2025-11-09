import { Injectable } from '@nestjs/common';
import { DiagramImage } from '../../../../domain/export/diagram-image.aggregate';
import { IDiagramImageRepository } from '../../../../domain/export/diagram-image.repository.interface';

/**
 * 인메모리 DiagramImage Repository 구현
 *
 * Phase 1+2: 저장 기능 제외, Export는 일회성 작업
 * - Map 기반 인메모리 저장
 * - TTL 1시간 (메모리 관리)
 * - 서버 재시작 시 데이터 손실 (의도된 동작)
 */
@Injectable()
export class InMemoryDiagramImageRepository implements IDiagramImageRepository {
  private readonly images: Map<string, { image: DiagramImage; expiresAt: number }> = new Map();
  private readonly TTL_MS = 60 * 60 * 1000; // 1시간

  constructor() {
    // 1분마다 만료된 항목 정리
    setInterval(() => this.cleanupExpired(), 60 * 1000);
  }

  async save(image: DiagramImage): Promise<void> {
    const expiresAt = Date.now() + this.TTL_MS;
    this.images.set(image.id, { image, expiresAt });
  }

  async findById(id: string): Promise<DiagramImage | null> {
    const entry = this.images.get(id);

    if (!entry) {
      return null;
    }

    // 만료된 경우 삭제하고 null 반환
    if (Date.now() > entry.expiresAt) {
      this.images.delete(id);
      return null;
    }

    return entry.image;
  }

  async delete(id: string): Promise<void> {
    this.images.delete(id);
  }

  /**
   * 만료된 항목 정리
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const expiredIds: string[] = [];

    for (const [id, entry] of this.images.entries()) {
      if (now > entry.expiresAt) {
        expiredIds.push(id);
      }
    }

    expiredIds.forEach((id) => this.images.delete(id));

    if (expiredIds.length > 0) {
      console.log(`[InMemoryDiagramImageRepository] Cleaned up ${expiredIds.length} expired images`);
    }
  }

  /**
   * 테스트용: 저장된 항목 수 반환
   */
  getSize(): number {
    return this.images.size;
  }
}

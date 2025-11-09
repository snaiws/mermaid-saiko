import { Module } from '@nestjs/common';
import {
  InMemoryDiagramRepository,
  InMemoryDiagramImageRepository,
  InMemoryEditorSessionRepository,
} from './memory/repositories';

/**
 * Persistence Module
 *
 * Phase 1+2: 인메모리 Repository 사용
 * - 저장 기능 제외 (프로젝트 범위)
 * - 렌더링/Export는 일회성 작업
 * - 서버 재시작 시 데이터 손실 (의도된 동작)
 */
@Module({
  providers: [
    InMemoryDiagramRepository,
    InMemoryDiagramImageRepository,
    InMemoryEditorSessionRepository,
  ],
  exports: [
    InMemoryDiagramRepository,
    InMemoryDiagramImageRepository,
    InMemoryEditorSessionRepository,
  ],
})
export class PersistenceModule {}

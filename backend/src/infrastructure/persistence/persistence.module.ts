import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm/typeorm.config';
import {
  DiagramEntity,
  DiagramImageEntity,
  EditorSessionEntity,
} from './typeorm/entities';
import {
  TypeOrmDiagramRepository,
  TypeOrmDiagramImageRepository,
  TypeOrmEditorSessionRepository,
} from './typeorm/repositories';

/**
 * Persistence Module
 *
 * TypeORM 설정 및 Repository 제공
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      DiagramEntity,
      DiagramImageEntity,
      EditorSessionEntity,
    ]),
  ],
  providers: [
    TypeOrmDiagramRepository,
    TypeOrmDiagramImageRepository,
    TypeOrmEditorSessionRepository,
  ],
  exports: [
    TypeOrmDiagramRepository,
    TypeOrmDiagramImageRepository,
    TypeOrmEditorSessionRepository,
  ],
})
export class PersistenceModule {}

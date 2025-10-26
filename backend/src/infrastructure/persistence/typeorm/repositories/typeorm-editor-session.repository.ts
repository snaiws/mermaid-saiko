import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEditorSessionRepository } from '../../../../domain/editor/editor-session.repository.interface';
import { EditorSession } from '../../../../domain/editor/editor-session.aggregate';
import { EditorSessionEntity } from '../entities/editor-session.entity';
import { EditorSessionMapper } from '../mappers/editor-session.mapper';

@Injectable()
export class TypeOrmEditorSessionRepository implements IEditorSessionRepository {
  constructor(
    @InjectRepository(EditorSessionEntity)
    private readonly repository: Repository<EditorSessionEntity>,
  ) {}

  async save(session: EditorSession): Promise<void> {
    const entity = EditorSessionMapper.toEntity(session);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<EditorSession | null> {
    const entity = await this.repository.findOne({ where: { id } });

    if (!entity) {
      return null;
    }

    return EditorSessionMapper.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

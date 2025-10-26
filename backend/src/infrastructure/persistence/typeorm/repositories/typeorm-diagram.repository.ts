import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDiagramRepository } from '../../../../domain/rendering/diagram.repository.interface';
import { Diagram } from '../../../../domain/rendering/diagram.aggregate';
import { DiagramEntity } from '../entities/diagram.entity';
import { DiagramMapper } from '../mappers/diagram.mapper';

@Injectable()
export class TypeOrmDiagramRepository implements IDiagramRepository {
  constructor(
    @InjectRepository(DiagramEntity)
    private readonly repository: Repository<DiagramEntity>,
  ) {}

  async save(diagram: Diagram): Promise<void> {
    const entity = DiagramMapper.toEntity(diagram);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Diagram | null> {
    const entity = await this.repository.findOne({ where: { id } });

    if (!entity) {
      return null;
    }

    return DiagramMapper.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

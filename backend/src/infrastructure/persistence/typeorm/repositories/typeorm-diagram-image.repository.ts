import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDiagramImageRepository } from '../../../../domain/export/diagram-image.repository.interface';
import { DiagramImage } from '../../../../domain/export/diagram-image.aggregate';
import { DiagramImageEntity } from '../entities/diagram-image.entity';
import { DiagramImageMapper } from '../mappers/diagram-image.mapper';

@Injectable()
export class TypeOrmDiagramImageRepository implements IDiagramImageRepository {
  constructor(
    @InjectRepository(DiagramImageEntity)
    private readonly repository: Repository<DiagramImageEntity>,
  ) {}

  async save(diagramImage: DiagramImage): Promise<void> {
    const entity = DiagramImageMapper.toEntity(diagramImage);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<DiagramImage | null> {
    const entity = await this.repository.findOne({ where: { id } });

    if (!entity) {
      return null;
    }

    return DiagramImageMapper.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

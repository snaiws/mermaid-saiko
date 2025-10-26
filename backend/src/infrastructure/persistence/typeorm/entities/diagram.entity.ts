import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { DiagramType } from '../../../../domain/rendering/diagram-type.enum';
import { RenderStatus } from '../../../../domain/rendering/render-status.enum';

@Entity('diagrams')
export class DiagramEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  mermaidCode: string;

  @Column({
    type: 'enum',
    enum: DiagramType,
  })
  diagramType: DiagramType;

  @Column('text', { nullable: true })
  renderedSvg: string | null;

  @Column({
    type: 'enum',
    enum: RenderStatus,
  })
  renderStatus: RenderStatus;

  @Column('text', { nullable: true })
  errorMessage: string | null;

  @Column('text', { nullable: true })
  errorCode: string | null;

  @CreateDateColumn()
  createdAt: Date;
}

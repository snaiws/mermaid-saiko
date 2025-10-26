import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { ImageFormat } from '../../../../domain/export/image-format.enum';
import { ExportStatus } from '../../../../domain/export/export-status.enum';

@Entity('diagram_images')
export class DiagramImageEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  sourceSvg: string;

  @Column({
    type: 'enum',
    enum: ImageFormat,
  })
  format: ImageFormat;

  @Column('bytea', { nullable: true })
  imageData: Buffer | null;

  @Column({
    type: 'enum',
    enum: ExportStatus,
  })
  exportStatus: ExportStatus;

  @Column('varchar', { length: 255 })
  fileName: string;

  @Column('int', { nullable: true })
  width: number | null;

  @Column('int', { nullable: true })
  height: number | null;

  @Column('int', { nullable: true })
  scale: number | null;

  @Column('varchar', { length: 50, nullable: true })
  backgroundColor: string | null;

  @Column('text', { nullable: true })
  errorMessage: string | null;

  @Column('text', { nullable: true })
  errorCode: string | null;

  @CreateDateColumn()
  createdAt: Date;
}

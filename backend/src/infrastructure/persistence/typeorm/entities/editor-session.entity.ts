import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('editor_sessions')
export class EditorSessionEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  currentCode: string;

  @Column('int')
  cursorLine: number;

  @Column('int')
  cursorColumn: number;

  @Column('simple-array')
  undoStack: string[];

  @Column('simple-array')
  redoStack: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastModifiedAt: Date;
}

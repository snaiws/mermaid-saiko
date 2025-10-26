import { DataSourceOptions } from 'typeorm';
import { DiagramEntity } from './entities/diagram.entity';
import { DiagramImageEntity } from './entities/diagram-image.entity';
import { EditorSessionEntity } from './entities/editor-session.entity';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'mermaid_saiko',
  entities: [DiagramEntity, DiagramImageEntity, EditorSessionEntity],
  synchronize: process.env.NODE_ENV !== 'production', // 개발 중에만 자동 동기화
  logging: process.env.NODE_ENV === 'development',
};

import { DiagramImage } from './diagram-image.aggregate';

/**
 * DiagramImage Repository 인터페이스
 *
 * DDD 원칙: Domain Layer에서 인터페이스 정의, Infrastructure Layer에서 구현
 */
export interface IDiagramImageRepository {
  /**
   * DiagramImage 저장
   */
  save(diagramImage: DiagramImage): Promise<void>;

  /**
   * ID로 DiagramImage 조회
   */
  findById(id: string): Promise<DiagramImage | null>;

  /**
   * DiagramImage 삭제
   */
  delete(id: string): Promise<void>;
}

import { Diagram } from './diagram.aggregate';

/**
 * Diagram Repository 인터페이스
 *
 * DDD 원칙: Domain Layer에서 인터페이스 정의, Infrastructure Layer에서 구현
 */
export interface IDiagramRepository {
  /**
   * Diagram 저장
   */
  save(diagram: Diagram): Promise<void>;

  /**
   * ID로 Diagram 조회
   */
  findById(id: string): Promise<Diagram | null>;

  /**
   * Diagram 삭제
   */
  delete(id: string): Promise<void>;
}

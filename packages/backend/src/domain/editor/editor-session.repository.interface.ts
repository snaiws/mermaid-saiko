import { EditorSession } from './editor-session.aggregate';

/**
 * EditorSession Repository 인터페이스
 *
 * DDD 원칙: Domain Layer에서 인터페이스 정의, Infrastructure Layer에서 구현
 *
 * 참고: Editor Context는 클라이언트 사이드에서 관리되므로
 * 실제로는 DB 저장이 필요하지 않을 수 있음 (선택적 구현)
 */
export interface IEditorSessionRepository {
  /**
   * EditorSession 저장
   */
  save(session: EditorSession): Promise<void>;

  /**
   * ID로 EditorSession 조회
   */
  findById(id: string): Promise<EditorSession | null>;

  /**
   * EditorSession 삭제
   */
  delete(id: string): Promise<void>;
}

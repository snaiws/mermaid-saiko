import { EditorSession } from '../../../../domain/editor/editor-session.aggregate';
import { CursorPosition } from '../../../../domain/editor/cursor-position.value-object';
import { CodeHistory } from '../../../../domain/editor/code-history.value-object';
import { EditorSessionEntity } from '../entities/editor-session.entity';

export class EditorSessionMapper {
  /**
   * Aggregate → Entity
   */
  static toEntity(session: EditorSession): EditorSessionEntity {
    const entity = new EditorSessionEntity();

    entity.id = session.id;
    entity.currentCode = session.currentCode;
    entity.cursorLine = session.cursorPosition.line;
    entity.cursorColumn = session.cursorPosition.column;
    entity.undoStack = session.history.undoStack;
    entity.redoStack = session.history.redoStack;
    entity.createdAt = session.createdAt;
    entity.lastModifiedAt = new Date();

    return entity;
  }

  /**
   * Entity → Aggregate
   */
  static toDomain(entity: EditorSessionEntity): EditorSession {
    const cursorPosition = CursorPosition.create(
      entity.cursorLine,
      entity.cursorColumn,
    );

    const history = CodeHistory.reconstitute(
      entity.undoStack,
      entity.redoStack,
    );

    return EditorSession.reconstitute(
      entity.id,
      entity.currentCode,
      cursorPosition,
      history,
      null, // lastRenderRequestedAt은 DB에 저장하지 않음 (세션 메모리 데이터)
      false, // isRenderPending도 세션 메모리 데이터
      entity.createdAt,
    );
  }
}

import { randomUUID } from 'crypto';
import { CursorPosition } from './cursor-position.value-object';
import { CodeHistory } from './code-history.value-object';
import { DomainEvent } from '../shared/domain-event.interface';
import { EditorSessionStartedEvent } from './events/editor-session-started.event';
import { CodeChangedEvent } from './events/code-changed.event';
import { RenderRequestedEvent } from './events/render-requested.event';
import { CodeUndoneEvent } from './events/code-undone.event';
import { CodeRedoneEvent } from './events/code-redone.event';

/**
 * EditorSession Aggregate Root
 *
 * 책임:
 * - 웹 에디터 세션 상태 관리
 * - 코드 변경 이력 관리 (Undo/Redo)
 * - 실시간 렌더링 요청 조율
 */
export class EditorSession {
  private static readonly DEBOUNCE_DELAY_MS = 300;

  private readonly _id: string;
  private _currentCode: string;
  private _cursorPosition: CursorPosition;
  private _history: CodeHistory;
  private _lastRenderRequestedAt: Date | null;
  private _isRenderPending: boolean;
  private readonly _createdAt: Date;
  private _domainEvents: DomainEvent[] = [];

  private constructor(
    id: string,
    currentCode: string,
    cursorPosition: CursorPosition,
    history: CodeHistory,
    lastRenderRequestedAt: Date | null,
    isRenderPending: boolean,
    createdAt: Date,
  ) {
    this._id = id;
    this._currentCode = currentCode;
    this._cursorPosition = cursorPosition;
    this._history = history;
    this._lastRenderRequestedAt = lastRenderRequestedAt;
    this._isRenderPending = isRenderPending;
    this._createdAt = createdAt;
  }

  /**
   * 새로운 EditorSession 생성 (Factory Method)
   */
  static create(): EditorSession {
    const id = randomUUID();
    const now = new Date();

    const session = new EditorSession(
      id,
      '', // 빈 코드로 시작
      CursorPosition.initial(), // (0, 0)
      CodeHistory.create(),
      null,
      false,
      now,
    );

    // 이벤트 발행
    session.addDomainEvent(
      new EditorSessionStartedEvent(randomUUID(), now, id),
    );

    return session;
  }

  /**
   * 기존 데이터로부터 EditorSession 재구성
   */
  static reconstitute(
    id: string,
    currentCode: string,
    cursorPosition: CursorPosition,
    history: CodeHistory,
    lastRenderRequestedAt: Date | null,
    isRenderPending: boolean,
    createdAt: Date,
  ): EditorSession {
    return new EditorSession(
      id,
      currentCode,
      cursorPosition,
      history,
      lastRenderRequestedAt,
      isRenderPending,
      createdAt,
    );
  }

  /**
   * 코드 업데이트
   */
  updateCode(newCode: string, cursorPosition: CursorPosition): void {
    // 코드가 동일하면 아무 작업도 하지 않음
    if (this._currentCode === newCode) {
      return;
    }

    // 현재 코드를 히스토리에 저장
    this._history = this._history.pushUndo(this._currentCode);

    // 새 코드로 업데이트
    this._currentCode = newCode;
    this._cursorPosition = cursorPosition;

    // 이벤트 발행
    this.addDomainEvent(
      new CodeChangedEvent(
        randomUUID(),
        new Date(),
        this._id,
        newCode,
        cursorPosition.line,
        cursorPosition.column,
      ),
    );
  }

  /**
   * 렌더링 요청
   */
  requestRender(): void {
    // 코드가 비어있으면 렌더링하지 않음
    if (this._currentCode.trim().length === 0) {
      return;
    }

    this._isRenderPending = true;
    this._lastRenderRequestedAt = new Date();

    // 이벤트 발행
    this.addDomainEvent(
      new RenderRequestedEvent(
        randomUUID(),
        new Date(),
        this._id,
        this._currentCode,
      ),
    );
  }

  /**
   * 렌더링 완료 처리
   */
  markRenderComplete(): void {
    this._isRenderPending = false;
  }

  /**
   * Undo 실행
   */
  undo(): void {
    const result = this._history.undo(this._currentCode);

    if (!result) {
      throw new Error('Cannot undo: no history available');
    }

    this._currentCode = result.code;
    this._history = result.history;

    // 이벤트 발행
    this.addDomainEvent(
      new CodeUndoneEvent(randomUUID(), new Date(), this._id, result.code),
    );
  }

  /**
   * Redo 실행
   */
  redo(): void {
    const result = this._history.redo(this._currentCode);

    if (!result) {
      throw new Error('Cannot redo: no future history available');
    }

    this._currentCode = result.code;
    this._history = result.history;

    // 이벤트 발행
    this.addDomainEvent(
      new CodeRedoneEvent(randomUUID(), new Date(), this._id, result.code),
    );
  }

  /**
   * 커서 위치 업데이트
   */
  updateCursor(position: CursorPosition): void {
    this._cursorPosition = position;
    // 이벤트 없음 (UI 상태만 변경)
  }

  /**
   * 히스토리 전체 삭제
   */
  clearHistory(): void {
    this._history = this._history.clear();
  }

  /**
   * Domain Event 추가
   */
  private addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Domain Events 가져오기 및 초기화
   */
  pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get currentCode(): string {
    return this._currentCode;
  }

  get cursorPosition(): CursorPosition {
    return this._cursorPosition;
  }

  get history(): CodeHistory {
    return this._history;
  }

  get lastRenderRequestedAt(): Date | null {
    return this._lastRenderRequestedAt;
  }

  get isRenderPending(): boolean {
    return this._isRenderPending;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get canUndo(): boolean {
    return this._history.canUndo;
  }

  get canRedo(): boolean {
    return this._history.canRedo;
  }

  static get debounceDelayMs(): number {
    return EditorSession.DEBOUNCE_DELAY_MS;
  }
}

import { randomUUID } from 'crypto';
import { MermaidCode } from './mermaid-code.value-object';
import { RenderingError } from './rendering-error.value-object';
import { RenderStatus } from './render-status.enum';
import { DomainEvent } from '../shared/domain-event.interface';
import { DiagramCreatedEvent } from './events/diagram-created.event';
import { DiagramRenderedEvent } from './events/diagram-rendered.event';
import { DiagramRenderFailedEvent } from './events/diagram-render-failed.event';
import { DiagramCodeUpdatedEvent } from './events/diagram-code-updated.event';

/**
 * Diagram Aggregate Root
 *
 * 책임:
 * - Mermaid 코드를 다이어그램으로 렌더링
 * - 렌더링 상태 관리
 * - 비즈니스 규칙 강제
 */
export class Diagram {
  private readonly _id: string;
  private _mermaidCode: MermaidCode;
  private _renderedSvg: string | null;
  private _renderStatus: RenderStatus;
  private _error: RenderingError | null;
  private readonly _createdAt: Date;
  private _domainEvents: DomainEvent[] = [];

  private constructor(
    id: string,
    mermaidCode: MermaidCode,
    renderedSvg: string | null,
    renderStatus: RenderStatus,
    error: RenderingError | null,
    createdAt: Date,
  ) {
    this._id = id;
    this._mermaidCode = mermaidCode;
    this._renderedSvg = renderedSvg;
    this._renderStatus = renderStatus;
    this._error = error;
    this._createdAt = createdAt;

    this.validateInvariants();
  }

  /**
   * 새로운 Diagram 생성 (Factory Method)
   */
  static create(mermaidCode: string): Diagram {
    const id = randomUUID();
    const code = MermaidCode.create(mermaidCode);
    const now = new Date();

    const diagram = new Diagram(
      id,
      code,
      null,
      RenderStatus.PENDING,
      null,
      now,
    );

    // 이벤트 발행
    diagram.addDomainEvent(
      new DiagramCreatedEvent(
        randomUUID(),
        now,
        id,
        code.rawCode,
        code.diagramType,
      ),
    );

    return diagram;
  }

  /**
   * 기존 데이터로부터 Diagram 재구성 (DB에서 로드 시 사용)
   */
  static reconstitute(
    id: string,
    mermaidCode: string,
    renderedSvg: string | null,
    renderStatus: RenderStatus,
    error: RenderingError | null,
    createdAt: Date,
  ): Diagram {
    const code = MermaidCode.create(mermaidCode);
    return new Diagram(id, code, renderedSvg, renderStatus, error, createdAt);
  }

  /**
   * 렌더링 성공 처리
   */
  markAsRendered(svg: string): void {
    if (!svg || svg.trim().length === 0) {
      throw new Error('Rendered SVG cannot be empty');
    }

    this._renderedSvg = svg;
    this._renderStatus = RenderStatus.SUCCESS;
    this._error = null;

    this.validateInvariants();

    // 이벤트 발행
    this.addDomainEvent(
      new DiagramRenderedEvent(randomUUID(), new Date(), this._id, svg),
    );
  }

  /**
   * 렌더링 실패 처리
   */
  markAsFailed(error: RenderingError): void {
    this._renderedSvg = null;
    this._renderStatus = RenderStatus.FAILED;
    this._error = error;

    this.validateInvariants();

    // 이벤트 발행
    this.addDomainEvent(
      new DiagramRenderFailedEvent(
        randomUUID(),
        new Date(),
        this._id,
        error.message,
        error.line,
        error.column,
      ),
    );
  }

  /**
   * Mermaid 코드 업데이트 (자동 재렌더링 트리거)
   */
  updateCode(newCode: string): void {
    const code = MermaidCode.create(newCode);

    // 코드가 동일하면 아무 작업도 하지 않음
    if (this._mermaidCode.equals(code)) {
      return;
    }

    this._mermaidCode = code;
    this._renderStatus = RenderStatus.PENDING;
    this._renderedSvg = null;
    this._error = null;

    // 이벤트 발행
    this.addDomainEvent(
      new DiagramCodeUpdatedEvent(
        randomUUID(),
        new Date(),
        this._id,
        code.rawCode,
        code.diagramType,
      ),
    );
  }

  /**
   * 렌더링된 SVG 가져오기
   */
  getSvg(): string {
    if (this._renderStatus !== RenderStatus.SUCCESS) {
      throw new Error('Diagram has not been successfully rendered');
    }

    // 비즈니스 규칙: 성공 시 SVG는 null이 아님
    if (!this._renderedSvg) {
      throw new Error('Invariant violation: SUCCESS status but no SVG');
    }

    return this._renderedSvg;
  }

  /**
   * 렌더링 에러 가져오기
   */
  getError(): RenderingError {
    if (this._renderStatus !== RenderStatus.FAILED) {
      throw new Error('Diagram has not failed rendering');
    }

    // 비즈니스 규칙: 실패 시 에러는 null이 아님
    if (!this._error) {
      throw new Error('Invariant violation: FAILED status but no error');
    }

    return this._error;
  }

  /**
   * 비즈니스 규칙 검증 (Invariants)
   */
  private validateInvariants(): void {
    // 규칙 1: 렌더링 성공 시 SVG 필수
    if (this._renderStatus === RenderStatus.SUCCESS && !this._renderedSvg) {
      throw new Error(
        'Invariant violation: SUCCESS status requires rendered SVG',
      );
    }

    // 규칙 2: 렌더링 실패 시 에러 필수
    if (this._renderStatus === RenderStatus.FAILED && !this._error) {
      throw new Error('Invariant violation: FAILED status requires error');
    }

    // 규칙 3: 성공 시 에러 없음
    if (this._renderStatus === RenderStatus.SUCCESS && this._error) {
      throw new Error('Invariant violation: SUCCESS status cannot have error');
    }
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

  get mermaidCode(): MermaidCode {
    return this._mermaidCode;
  }

  get renderedSvg(): string | null {
    return this._renderedSvg;
  }

  get renderStatus(): RenderStatus {
    return this._renderStatus;
  }

  get error(): RenderingError | null {
    return this._error;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}

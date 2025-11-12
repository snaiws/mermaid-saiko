/**
 * Domain Event 기본 인터페이스
 *
 * 모든 Domain Event는 이 인터페이스를 구현해야 함
 */
export interface DomainEvent {
  /**
   * 이벤트 고유 ID
   */
  eventId: string;

  /**
   * 이벤트 발생 시각
   */
  occurredAt: Date;

  /**
   * Aggregate ID (이벤트를 발생시킨 Aggregate의 ID)
   */
  aggregateId: string;

  /**
   * 이벤트 타입 (이벤트 구분용)
   */
  eventType: string;
}

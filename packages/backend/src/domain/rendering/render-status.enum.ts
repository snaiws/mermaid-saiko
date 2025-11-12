/**
 * 다이어그램 렌더링 상태
 */
export enum RenderStatus {
  PENDING = 'pending', // 렌더링 대기
  SUCCESS = 'success', // 렌더링 성공
  FAILED = 'failed', // 렌더링 실패
}

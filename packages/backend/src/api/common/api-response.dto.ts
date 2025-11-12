/**
 * 성공 응답 DTO
 */
export class ApiSuccessResponse<T> {
  success: boolean = true;
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

/**
 * 에러 응답 DTO
 */
export class ApiErrorResponse {
  success: boolean = false;
  error: {
    code: string;
    message: string;
    details?: any;
  };

  constructor(code: string, message: string, details?: any) {
    this.error = {
      code,
      message,
      details,
    };
  }
}

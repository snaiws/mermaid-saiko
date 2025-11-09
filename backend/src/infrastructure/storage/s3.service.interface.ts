export interface IS3Service {
  /**
   * 파일을 S3에 업로드하고 공개 URL 반환
   */
  uploadFile(
    buffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string>;

  /**
   * S3에서 파일 삭제
   */
  deleteFile(fileName: string): Promise<void>;
}

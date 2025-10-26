import { randomUUID } from 'crypto';
import { ImageFormat } from './image-format.enum';
import { ExportStatus } from './export-status.enum';
import { ExportOptions } from './export-options.value-object';
import { ExportError } from './export-error.value-object';
import { DomainEvent } from '../shared/domain-event.interface';
import { ImageExportRequestedEvent } from './events/image-export-requested.event';
import { ImageExportedEvent } from './events/image-exported.event';
import { ImageExportFailedEvent } from './events/image-export-failed.event';
import { ImageResizedEvent } from './events/image-resized.event';

/**
 * DiagramImage Aggregate Root
 *
 * 책임:
 * - 렌더링된 SVG를 다양한 포맷으로 변환
 * - Export 옵션 관리
 * - 비즈니스 규칙 강제
 */
export class DiagramImage {
  private readonly _id: string;
  private readonly _sourceSvg: string;
  private readonly _format: ImageFormat;
  private _imageData: Buffer | string | null;
  private _options: ExportOptions;
  private _exportStatus: ExportStatus;
  private _error: ExportError | null;
  private readonly _createdAt: Date;
  private _fileSize: number;
  private _domainEvents: DomainEvent[] = [];

  private constructor(
    id: string,
    sourceSvg: string,
    format: ImageFormat,
    imageData: Buffer | string | null,
    options: ExportOptions,
    exportStatus: ExportStatus,
    error: ExportError | null,
    createdAt: Date,
    fileSize: number,
  ) {
    this._id = id;
    this._sourceSvg = sourceSvg;
    this._format = format;
    this._imageData = imageData;
    this._options = options;
    this._exportStatus = exportStatus;
    this._error = error;
    this._createdAt = createdAt;
    this._fileSize = fileSize;

    this.validateInvariants();
  }

  /**
   * 새로운 DiagramImage 생성 (Factory Method)
   */
  static create(
    sourceSvg: string,
    format: ImageFormat,
    options?: {
      fileName?: string | null;
      width?: number | null;
      height?: number | null;
      scale?: number;
    },
  ): DiagramImage {
    // 비즈니스 규칙: 소스 SVG는 비어있을 수 없음
    if (!sourceSvg || sourceSvg.trim().length === 0) {
      throw new Error('Source SVG cannot be empty');
    }

    const id = randomUUID();
    const exportOptions = ExportOptions.create(options);
    const now = new Date();

    const diagramImage = new DiagramImage(
      id,
      sourceSvg.trim(),
      format,
      null,
      exportOptions,
      ExportStatus.PENDING,
      null,
      now,
      0,
    );

    // 이벤트 발행
    diagramImage.addDomainEvent(
      new ImageExportRequestedEvent(
        randomUUID(),
        now,
        id,
        format,
        exportOptions.width,
        exportOptions.height,
      ),
    );

    return diagramImage;
  }

  /**
   * 기존 데이터로부터 DiagramImage 재구성
   */
  static reconstitute(
    id: string,
    sourceSvg: string,
    format: ImageFormat,
    imageData: Buffer | string | null,
    options: ExportOptions,
    exportStatus: ExportStatus,
    error: ExportError | null,
    createdAt: Date,
    fileSize: number,
  ): DiagramImage {
    return new DiagramImage(
      id,
      sourceSvg,
      format,
      imageData,
      options,
      exportStatus,
      error,
      createdAt,
      fileSize,
    );
  }

  /**
   * Export 성공 처리
   */
  markAsExported(imageData: Buffer | string): void {
    if (!imageData) {
      throw new Error('Image data cannot be empty');
    }

    this._imageData = imageData;
    this._exportStatus = ExportStatus.SUCCESS;
    this._error = null;

    // 파일 크기 계산
    if (Buffer.isBuffer(imageData)) {
      this._fileSize = imageData.length;
    } else {
      this._fileSize = Buffer.from(imageData).length;
    }

    this.validateInvariants();

    // 이벤트 발행
    this.addDomainEvent(
      new ImageExportedEvent(
        randomUUID(),
        new Date(),
        this._id,
        this._format,
        this._fileSize,
      ),
    );
  }

  /**
   * Export 실패 처리
   */
  markAsFailed(error: ExportError): void {
    this._imageData = null;
    this._exportStatus = ExportStatus.FAILED;
    this._error = error;
    this._fileSize = 0;

    this.validateInvariants();

    // 이벤트 발행
    this.addDomainEvent(
      new ImageExportFailedEvent(
        randomUUID(),
        new Date(),
        this._id,
        error.message,
      ),
    );
  }

  /**
   * 이미지 데이터 가져오기
   */
  getImageData(): Buffer | string {
    if (this._exportStatus !== ExportStatus.SUCCESS) {
      throw new Error('Image has not been successfully exported');
    }

    // 비즈니스 규칙: 성공 시 데이터는 null이 아님
    if (!this._imageData) {
      throw new Error(
        'Invariant violation: SUCCESS status but no image data',
      );
    }

    return this._imageData;
  }

  /**
   * 파일명 가져오기 (확장자 포함)
   */
  getFileName(): string {
    const fileName = this._options.fileName;

    // 옵션에 파일명이 있으면 그대로 사용 (확장자 추가)
    if (fileName) {
      return `${fileName}.${this._format}`;
    }

    // 없으면 자동 생성: diagram-{timestamp}.{format}
    const timestamp = this._createdAt.getTime();
    return `diagram-${timestamp}.${this._format}`;
  }

  /**
   * PNG 이미지 크기 재조정
   */
  resize(width: number, height: number): void {
    // 비즈니스 규칙: SVG는 크기 조정 불가
    if (this._format === ImageFormat.SVG) {
      throw new Error('Cannot resize SVG format');
    }

    // 크기 유효성 검증
    if (width <= 0 || height <= 0) {
      throw new Error('Width and height must be greater than 0');
    }

    // 옵션 업데이트
    this._options = ExportOptions.create({
      fileName: this._options.fileName,
      width,
      height,
      scale: this._options.scale,
    });

    // 재변환 필요 (상태를 PENDING으로 변경)
    this._exportStatus = ExportStatus.PENDING;
    this._imageData = null;
    this._error = null;
    this._fileSize = 0;

    // 이벤트 발행
    this.addDomainEvent(
      new ImageResizedEvent(randomUUID(), new Date(), this._id, width, height),
    );
  }

  /**
   * 비즈니스 규칙 검증 (Invariants)
   */
  private validateInvariants(): void {
    // 규칙 1: Export 성공 시 데이터 필수
    if (this._exportStatus === ExportStatus.SUCCESS && !this._imageData) {
      throw new Error(
        'Invariant violation: SUCCESS status requires image data',
      );
    }

    // 규칙 2: Export 실패 시 에러 필수
    if (this._exportStatus === ExportStatus.FAILED && !this._error) {
      throw new Error('Invariant violation: FAILED status requires error');
    }

    // 규칙 3: 성공 시 에러 없음
    if (this._exportStatus === ExportStatus.SUCCESS && this._error) {
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

  get sourceSvg(): string {
    return this._sourceSvg;
  }

  get format(): ImageFormat {
    return this._format;
  }

  get imageData(): Buffer | string | null {
    return this._imageData;
  }

  get options(): ExportOptions {
    return this._options;
  }

  get exportStatus(): ExportStatus {
    return this._exportStatus;
  }

  get error(): ExportError | null {
    return this._error;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get fileSize(): number {
    return this._fileSize;
  }
}

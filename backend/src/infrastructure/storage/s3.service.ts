import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { IS3Service } from './s3.service.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service implements IS3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly endpoint: string;

  constructor() {
    const endpoint = process.env.S3_ENDPOINT || 'http://localhost:50008';
    const region = process.env.S3_REGION || 'us-east-1';
    const accessKeyId = process.env.S3_ACCESS_KEY_ID || 'admin';
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || 'password';
    this.bucketName = process.env.S3_BUCKET_NAME || 'mermaid-diagrams';

    this.endpoint = endpoint;

    this.s3Client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // MinIO는 path-style URL 필요
    });
  }

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    // UUID를 사용해서 고유 파일명 생성
    const uniqueFileName = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    // MinIO public URL 반환
    return `${this.endpoint}/${this.bucketName}/${uniqueFileName}`;
  }

  async deleteFile(fileName: string): Promise<void> {
    // 구현 필요시 추가
    throw new Error('Delete not implemented');
  }
}

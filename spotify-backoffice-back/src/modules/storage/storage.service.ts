import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT_INTERNAL');
    const accessKeyId = this.configService.get<string>('MINIO_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('MINIO_SECRET_KEY');
    const region = this.configService.get<string>('MINIO_REGION') || 'us-east-1';
    const forcePathStyle = this.configService.get<string>('S3_FORCE_PATH_STYLE') !== 'false';

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error('Configurações do MinIO (S3) ausentes no arquivo de ambiente.');
    }

    this.s3Client = new S3Client({
      endpoint,
      region,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle,
    });

    this.bucket = this.configService.get<string>('MINIO_BUCKET') || 'uploads';
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const uniqueName = crypto.randomUUID();
      const extension = path.extname(file.originalname);
      const objectKey = `${uniqueName}${extension}`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: objectKey,
          Body: file.buffer,
          ContentType: file.mimetype || 'application/octet-stream',
          ACL: 'public-read',
        }),
      );

      return objectKey;
    } catch (error: any) {
      throw new InternalServerErrorException(`Falha ao subir arquivo para o storage: ${error.message}`);
    }
  }

  async deleteFile(objectKey: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: objectKey,
        }),
      );
    } catch (error: any) {
      throw new InternalServerErrorException(`Falha ao deletar arquivo do storage: ${error.message}`);
    }
  }
}

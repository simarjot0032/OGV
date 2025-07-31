import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UploadModel } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async getAllUploads(): Promise<UploadModel[]> {
    return this.uploadModel.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUploadById(id: string): Promise<UploadModel | null> {
    return this.uploadModel.findUnique({
      where: { id },
    });
  }

  async createUpload(data: {
    thumbnailUrl: string;
    title: string;
    description: string;
    category: string;
    license: string;
    expiresIn: number;
    originalFileName: string;
    originalFileUrl: string;
    originalFileFormat: string;
    originalFileSize: number;
    convertedFileUrl: string;
    userIP: string;
  }): Promise<UploadModel> {
    return this.uploadModel.create({
      data,
    });
  }
}

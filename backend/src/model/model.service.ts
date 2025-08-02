import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ModelService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllUploads() {
    try {
      const uploads = await this.prisma.getAllUploads();
      return {
        success: true,
        data: uploads,
        count: uploads.length,
      };
    } catch (error) {
      console.error('Failed to get uploads from database:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve uploads',
      };
    }
  }
  async getUploadById(id: string) {
    try {
      const upload = await this.prisma.getUploadById(id);
      if (!upload) {
        return {
          success: false,
          error: 'Upload not found',
        };
      }
      return {
        success: true,
        data: upload,
      };
    } catch (error) {
      console.error('Failed to get upload by ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve upload',
      };
    }
  }
}

import { Controller, Post, UseInterceptors, UploadedFile, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConverterService } from './converter.service';
import { multerConfig } from './config/multer.config';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('converter')
export class ConverterController {
  constructor(private readonly converterService: ConverterService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('outputFormat') outputFormat: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      this.converterService.validateFile(file, outputFormat.toLowerCase());

      const outputPath = await this.converterService.convertFile(file, outputFormat.toLowerCase());

      return res.download(outputPath, (err) => {
        const inputPath = file.path;

        if (err) {
          console.error('Download error:', err);
          res.status(500).send('Failed to send the converted file.');
          return;
        }

        try {
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (cleanupErr) {
          console.warn('File cleanup warning:', cleanupErr);
        }
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      res.status(500).json({ message });
    }
  }
}

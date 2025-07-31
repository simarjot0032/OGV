import { Controller, Post, UseInterceptors, UploadedFile, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConverterService } from './converter.service';
import { multerConfig } from './config/multer.config';
import { ConversionRequestDto } from './dto';
import { Response } from 'express';
import * as path from 'path';

@Controller('converter')
export class ConverterController {
  constructor(private readonly converterService: ConverterService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ConversionRequestDto,
    @Res() res: Response
  ): Promise<void> {
    try {
      let outputFormats: string[];

      if (!body.outputFormat) {
        res.status(400).json({ message: 'outputFormat is required' });
        return;
      }

      if (typeof body.outputFormat === 'string') {
        try {
          const parsed = JSON.parse(body.outputFormat) as unknown;
          if (Array.isArray(parsed) && parsed.every((f) => typeof f === 'string')) {
            outputFormats = parsed.map((format) => format.toLowerCase());
          } else {
            outputFormats = [body.outputFormat.toLowerCase()];
          }
        } catch {
          outputFormats = [body.outputFormat.toLowerCase()];
        }
      } else if (Array.isArray(body.outputFormat)) {
        outputFormats = body.outputFormat.map((format) => format.toLowerCase());
      } else {
        res.status(400).json({ message: 'outputFormat must be a string or array' });
        return;
      }

      this.converterService.validateMultipleFormats(file, outputFormats);

      const result = await this.converterService.convertToMultipleFormats(file, outputFormats);

      if (!result.success) {
        res.status(500).json({ message: result.message || 'Conversion failed' });
        return;
      }

      if (result.files.length === 1) {
        const convertedFile = result.files[0];
        res.download(convertedFile.path, convertedFile.filename, (err) => {
          if (err) {
            console.error('Download error:', err);
            res.status(500).send('Failed to send the converted file.');
          }
        });
      } else {
        const originalFileName = file.originalname;
        const fileNameWithoutExtension = path.basename(
          originalFileName,
          path.extname(originalFileName)
        );

        const zipPath = await this.converterService.createZipFile(
          result.files,
          fileNameWithoutExtension
        );

        res.download(zipPath, `${fileNameWithoutExtension}_converted.zip`, (err) => {
          if (err) {
            console.error('Download error:', err);
            res.status(500).send('Failed to send the zip file.');
          }
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      res.status(500).json({ message });
    }
  }
}

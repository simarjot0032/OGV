import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadRequestDto } from './dto/UploadRequest.dto';
import { multerConfig } from './config/multer.config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ConverterService } from 'src/converter/converter.service';
import { Request } from 'express';
import { FileURL } from 'src/types/FileURL';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly converterService: ConverterService
  ) {}

  @Post('model')
  @UseGuards(ThrottlerGuard)
  @UseInterceptors(AnyFilesInterceptor(multerConfig))
  async uploadModel(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: Omit<UploadRequestDto, 'file' | 'thumbnailImage'>,
    @Req() req: Request
  ) {
    const file = files.find((f) => f.fieldname === 'file');
    const thumbnailImage = files.find((f) => f.fieldname === 'thumbnailImage');

    if (!file || !thumbnailImage) {
      return {
        success: false,
        error: 'Both file and thumbnail image are required',
        debug: {
          totalFiles: files.length,
          availableFieldnames: files.map((f) => f.fieldname),
          fileFound: !!file,
          thumbnailFound: !!thumbnailImage,
          requestHeaders: Object.keys(req.headers),
          contentType: req.headers['content-type'],
        },
      };
    }

    const request: UploadRequestDto = {
      ...body,
      file,
      thumbnailImage,
    };
    const fileURL: FileURL = {
      rawModelURL: '',
      convertedModelURL: '',
      thumbnailImageURL: '',
    };

    const validationResult = this.uploadService.validateRequest(request);
    if (!validationResult.success) {
      return {
        success: false,
        error: 'message' in validationResult ? validationResult.message : 'Validation failed',
      };
    }

    const result = await this.uploadService.processUploadWithCleanup(file, thumbnailImage, fileURL);
    return result;
  }
}

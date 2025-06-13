import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { OutputFormats } from './constants';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';

@Injectable()
export class ConverterService {
  validateFile(file: Express.Multer.File, outputFormat: string) {
    const inputFormat: string = file?.originalname.split('.').pop() || '';
    if (!file) {
      throw new BadRequestException('File is required or invalid file format');
    } else if (!outputFormat) {
      throw new BadRequestException('Output format is required');
    } else if (inputFormat === outputFormat) {
      throw new BadRequestException('Input and output formats cannot be the same');
    } else if (!OutputFormats.includes(outputFormat)) {
      throw new BadRequestException('Output format not supported');
    } else {
      return {
        status: true,
      };
    }
  }
  async convertFile(file: Express.Multer.File, outputFormat: string): Promise<string> {
    const originalFileName = file.originalname;
    const fileNameWithoutExtension = path.basename(
      originalFileName,
      path.extname(originalFileName)
    );
    const outputFolder = path.join(__dirname, '.', 'uploads', 'outputs');
    const inputFolder = path.join(__dirname, '.', 'uploads', 'inputs');
    fs.mkdirSync(outputFolder, { recursive: true });
    const outputPath = path.join(outputFolder, `${fileNameWithoutExtension}.${outputFormat}`);
    const inputPath = path.join(inputFolder, originalFileName);

    return new Promise((resolve, reject) => {
      const gcv = spawn('gcv', [inputPath, outputPath]);

      let stderr: string = '';

      gcv.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      gcv.on('error', (error) => {
        reject(new InternalServerErrorException(`Failed to start gcv: ${error.message}`));
      });

      gcv.on('close', (code) => {
        if (code === 0 && fs.existsSync(outputPath)) {
          resolve(outputPath);
        } else {
          reject(new InternalServerErrorException(`gcv failed [${code}]: ${stderr}`));
        }
      });
    });
  }
}

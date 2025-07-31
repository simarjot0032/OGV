import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { OutputFormats, InputFormats } from '../constants';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { ConversionResponseDto, ConversionFile } from './dto';
import * as archiver from 'archiver';
import { StorageConfig } from 'src/config/storage.config';

@Injectable()
export class ConverterService {
  validateMultipleFormats(file: Express.Multer.File, outputFormats: string[]) {
    const inputFormat: string = file?.originalname.split('.').pop()?.toLowerCase() || '';

    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!inputFormat) {
      throw new BadRequestException('File must have a valid extension');
    }

    if (!InputFormats.includes(inputFormat)) {
      throw new BadRequestException(
        `Input format not supported: ${inputFormat}. Supported formats: ${InputFormats.join(', ')}`
      );
    }

    if (!outputFormats || outputFormats.length === 0) {
      throw new BadRequestException('At least one output format is required');
    }

    const uniqueFormats = new Set(outputFormats);
    if (uniqueFormats.size !== outputFormats.length) {
      throw new BadRequestException('Duplicate output formats are not allowed');
    }

    for (const format of outputFormats) {
      if (inputFormat === format) {
        throw new BadRequestException(`Input and output format cannot be the same: ${format}`);
      }
      if (!OutputFormats.includes(format)) {
        throw new BadRequestException(
          `Output format not supported: ${format}. Supported formats: ${OutputFormats.join(', ')}`
        );
      }
    }

    return {
      status: true,
    };
  }

  async convertToMultipleFormats(
    file: Express.Multer.File,
    outputFormats: string[]
  ): Promise<ConversionResponseDto> {
    const originalFileName = file.originalname;
    const fileNameWithoutExtension = path.basename(
      originalFileName,
      path.extname(originalFileName)
    );
    const outputFolder = StorageConfig.CONVERTER_OUTPUT_PATH;
    const inputFolder = StorageConfig.CONVERTER_INPUT_PATH;
    fs.mkdirSync(outputFolder, { recursive: true });
    const inputPath = path.join(inputFolder, originalFileName);

    const conversionPromises = outputFormats.map(async (format) => {
      const outputPath = path.join(outputFolder, `${fileNameWithoutExtension}.${format}`);

      return new Promise<ConversionFile>((resolve, reject) => {
        const gcv = spawn('gcv', [inputPath, outputPath]);

        let stderr: string = '';

        gcv.stderr.on('data', (data: Buffer) => {
          stderr += data.toString();
        });

        gcv.on('error', (error) => {
          reject(
            new InternalServerErrorException(`Failed to start gcv for ${format}: ${error.message}`)
          );
        });

        gcv.on('close', (code) => {
          if (code === 0 && fs.existsSync(outputPath)) {
            resolve({
              format,
              path: outputPath,
              filename: `${fileNameWithoutExtension}.${format}`,
            });
          } else {
            console.error(`gcv failed for ${format} [${code}]: ${stderr}`);
            reject(new InternalServerErrorException(`gcv failed to convert ${format}`));
          }
        });
      });
    });

    try {
      const files = await Promise.all(conversionPromises);
      console.log(
        `All conversions completed. Files:`,
        files.map((f) => f.filename)
      );
      return {
        success: true,
        files,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
      console.error('Conversion failed:', errorMessage);
      return {
        success: false,
        files: [],
        message: errorMessage,
      };
    }
  }

  async createZipFile(files: ConversionFile[], baseFileName: string): Promise<string> {
    const outputFolder = StorageConfig.CONVERTER_OUTPUT_PATH;
    const zipPath = path.join(outputFolder, `${baseFileName}_converted.zip`);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingFiles = files.filter((file) => {
          const exists = fs.existsSync(file.path);
          if (!exists) {
            console.warn(`File not found: ${file.path}`);
          }
          return exists;
        });

        if (existingFiles.length === 0) {
          reject(new InternalServerErrorException('No converted files found to zip'));
          return;
        }

        console.log(`Creating zip with ${existingFiles.length} files`);

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
          zlib: { level: 9 },
        });

        let hasError = false;

        output.on('close', () => {
          if (!hasError) {
            console.log(`Zip created successfully: ${zipPath}`);
            resolve(zipPath);
          }
        });

        output.on('error', (err) => {
          hasError = true;
          console.error('Zip write error:', err);
          reject(new InternalServerErrorException(`Failed to write zip: ${err.message}`));
        });

        archive.on('error', (err) => {
          hasError = true;
          console.error('Zip creation error:', err);
          reject(new InternalServerErrorException(`Failed to create zip: ${err.message}`));
        });

        archive.on('warning', (err) => {
          console.warn('Zip warning:', err);
        });

        archive.pipe(output);

        existingFiles.forEach((file) => {
          try {
            console.log(`Adding file to zip: ${file.filename} from ${file.path}`);
            archive.file(file.path, { name: file.filename });
          } catch (err) {
            console.error(`Error adding file ${file.filename} to zip:`, err);
          }
        });

        void archive.finalize();
      }, 1000);
    });
  }
}

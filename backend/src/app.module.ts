import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConverterModule } from './converter/converter.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { StorageService } from './services/storage.service';

@Module({
  imports: [ConverterModule, PrismaModule, UploadModule],
  controllers: [AppController],
  providers: [AppService, StorageService],
})
export class AppModule {}

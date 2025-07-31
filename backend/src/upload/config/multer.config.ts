import { diskStorage, FileFilterCallback } from 'multer';
import { InputFormats, ValidImageFormats } from 'src/constants';
import * as fs from 'fs';
import { MIME_Types, ValidImageMimeTypes } from 'src/constants/ValidMIME';
import { StorageConfig } from 'src/config/storage.config';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const ext: string = file.originalname.split('.').pop()?.toLowerCase() || '';

      let uploadPath: string;

      if (InputFormats.includes(ext)) {
        uploadPath = StorageConfig.RAW_FILES_PATH;
      } else if (ValidImageFormats.includes(ext)) {
        uploadPath = StorageConfig.THUMBNAIL_PATH;
      } else {
        uploadPath = StorageConfig.TEMP_FILES_PATH;
      }
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const filename = `${file.originalname}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const ext: string = file.originalname.split('.').pop()?.toLowerCase() || '';
    const fileMimeType: string = file.mimetype.toLowerCase();

    const isValidModelFormat = InputFormats.includes(ext);
    const expectedModelMimeType = MIME_Types[ext];
    const isValidModelMIME = expectedModelMimeType ? fileMimeType === expectedModelMimeType : false;

    const isValidImageFormat = ValidImageFormats.includes(ext);
    const isValidImageMIME = ValidImageMimeTypes.includes(fileMimeType);

    if ((isValidModelFormat && isValidModelMIME) || (isValidImageFormat && isValidImageMIME)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
};

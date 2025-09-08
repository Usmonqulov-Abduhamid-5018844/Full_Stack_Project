import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class FileValidation implements PipeTransform<any> {
  private readonly allowedExts = [
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.csv',
    '.txt'
  ];

  transform(value: Express.Multer.File | Express.Multer.File[] | any) {
    try {
      if (!value) return value;


      if (Array.isArray(value)) {
        value.forEach((file) => this.validateFile(file));
        return value;
      }


      if (typeof value === 'object' && !value.originalname) {
        Object.values(value).forEach((files: any) => {
          if (Array.isArray(files)) {
            files.forEach((file) => this.validateFile(file));
          }
        });
        return value;
      }


      return this.validateFile(value);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private validateFile(file: Express.Multer.File) {
    if (!file?.originalname) {
      throw new BadRequestException('File is missing');
    }
    const fileExt = extname(file.originalname).toLowerCase();
    if (!this.allowedExts.includes(fileExt)) {
      throw new BadRequestException(
        "Only PDF, Word, Excel, CSV and TXT formats can be uploaded",
      );
    }
    return file;
  }
}

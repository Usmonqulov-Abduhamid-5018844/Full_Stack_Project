import { Injectable, NotFoundException } from '@nestjs/common';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { FileService } from '../file/file.service';

@Injectable()
export class FileDeleteService {
  constructor(private readonly fileService: FileService) {}
  async remove(URL: string) {
    try {
      if (await this.fileService.existFile(URL)) {
        await this.fileService.deleteFile(URL);
      } else {
        throw new NotFoundException('File URL Not Fount');
      }
      return { statusCode: 200, message: 'Delete file' };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

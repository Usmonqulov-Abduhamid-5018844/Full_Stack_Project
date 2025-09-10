import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class ImageValidation implements PipeTransform<any> {
  private readonly allowedExtends = ['.jpeg', '.jpg', '.png', '.svg', '.heic'];
  transform(value: any) {
    try {
      if (value) {
        const file = value?.originalname;
        const fileExtends = extname(file).toLowerCase();
        if (!this.allowedExtends.includes(fileExtends)) {
          throw new BadRequestException(
            "  'Only JPEG, heic, JPG, PNG, SVG formats can be uploaded'",
          );
        }
        return value;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

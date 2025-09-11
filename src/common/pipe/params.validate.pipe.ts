import { PipeTransform, BadRequestException } from '@nestjs/common';

export class ParseIdPipe implements PipeTransform {
  transform(value: any) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`Id raqam bo'lishi kerak`);
    }
    return val;
  }
}

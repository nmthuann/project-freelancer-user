import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidatorPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // Kiểm tra xem giá trị truyền vào có phải là object không
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Invalid input');
    }

    // Tạo instance mới từ class đang validate và convert giá trị truyền vào thành instance đó
    const obj = plainToClass(metadata.metatype, value);

    // Sử dụng class-validator để validate instance
    const errors = await validate(obj);

    // Nếu có lỗi, throw BadRequestException với thông tin lỗi
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Nếu không có lỗi, trả về instance đã validate
    return obj;
  }
}

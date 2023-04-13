import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'HELLO! THIS IS USER SERVICE!';
  }
}

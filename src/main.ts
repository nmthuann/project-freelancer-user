import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // tiền tố api
  //app.useGlobalPipes(new ValidationPipe());
  console.log('UserModule, here')
  await app.listen(3000, () => (console.log(':localhost:3000')));
  }
  
bootstrap();

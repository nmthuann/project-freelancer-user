import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('user'); // tiền tố api
  //app.useGlobalPipes(new ValidationPipe());
  console.log('UserModule connect successfully .......  !!!');
  await app.listen(8088, () => console.log('http://localhost:8088'));
}
bootstrap();

// async function bootstrap() {
//   dotenv.config();
//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
//     transport: Transport.KAFKA,
//     options: {
//       client: {
//         brokers: ['localhost:9092'],
//       },
//       consumer: {
//         groupId: 'auth-consumer'
//       }
//     }
//   });
//   await app.listen();
// }
// bootstrap();

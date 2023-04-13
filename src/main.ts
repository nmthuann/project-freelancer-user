import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('user'); // tiền tố api
  //app.useGlobalPipes(new ValidationPipe());
  console.log('UserModule connect successfully .......  !!!')
  await app.listen(3000, () => (console.log('http://localhost:3000')));
  }
bootstrap();
  
// async function bootstrap() {
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
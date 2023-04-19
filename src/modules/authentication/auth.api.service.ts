import { Kafka, logLevel } from 'kafkajs';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ProducerService } from 'src/modules/kafka/producer.service';
import { ConsumerService } from 'src/modules/kafka/consumer.service';

@Injectable()
export class AuthApiGatewayService {
  constructor(
    private producerService: ProducerService,
    private consumerService: ConsumerService,
    private authService: AuthService
  ){}


  async handleLogin(){
    this.consumerService.consume(   
      'auth-service',
      { topic: 'api-auth-login-req'},
      {
        eachMessage: async ({ topic, partition, message }) => {
          const input = JSON.parse(message.value.toString());
          console.log({
            //source: 'create-consumer',
            partition: partition.toString(),
            topic: topic.toString(),
            input: input
          });

          // handle Login with Auth Service
          const result = await this.authService.login(input);
          console.log(result);

          await this.producerService.onModuleInit();
          await this.producerService.produce({
            topic: 'auth-api-login-res',
            messages: [{value: JSON.stringify(result)}],// có thể lỗi ở đây
            timeout: 6000 // chỗ này chưa ổn
          });
          await this.producerService.onApplicationShutdown();
        },
      },
    );
    await this.consumerService.onApplicationShutdown();
  }

  async handleRegister(){
    await this.consumerService.consume(   
      'auth-service',
      { topic: 'api-auth-register-req'},
      {
        eachMessage: async ({ topic, partition, message }) => {
          const input = JSON.parse(message.value.toString());
          console.log({
            partition: partition.toString(),
            topic: topic.toString(),
            input: input
          });

          const result = await this.authService.registerUser(input);
          console.log("Check - register:", result);

          await this.producerService.onModuleInit();
          await this.producerService.produce({
            topic: 'auth-api-register-res',
            messages: [{value: JSON.stringify(result)}],// có thể lỗi ở đây
            timeout: 6000 // chỗ này chưa ổn
          });
          await this.producerService.onApplicationShutdown();
        },
      },
    );
    this.consumerService.onApplicationShutdown();
  }

  async handleLogout(){
    this.consumerService.consume(   
      'auth-service',
      { topic: 'api-auth-logout-req'},
      {
        eachMessage: async ({ message }) => {
          //message: is email
          const result = await this.authService.logout(message.value.toString());
          console.log("Check-logout: ",result);

          await this.producerService.onModuleInit();
          await this.producerService.produce({
            topic: 'auth-api-logout-res',
            messages: [{value: JSON.stringify(result)}],// có thể lỗi ở đây
            timeout: 6000 // chỗ này chưa ổn
          });
          await this.producerService.onApplicationShutdown();
        },
      },
    );
    this.consumerService.onApplicationShutdown();
  }

  async handleRefreshToken(){
    this.consumerService.consume(   
      'auth-service',
      { topic: 'api-auth-refresh-req'},
      {
        eachMessage: async ({ topic, partition, message }) => {
          const input = JSON.parse(message.value.toString());
          console.log({
            partition: partition.toString(),
            topic: topic.toString(),
            input: input
          });

          const result = await this.authService.refreshToken(input);
          console.log(result);

          await this.producerService.onModuleInit();
          await this.producerService.produce({
            topic: 'auth-api-refresh-res',
            messages: [{value: JSON.stringify(result)}],// có thể lỗi ở đây
            timeout: 6000 // chỗ này chưa ổn
          });
          await this.producerService.onApplicationShutdown();
        },
      },
    );
    this.consumerService.onApplicationShutdown();
  }

  async handleForgetPassword(){
    this.consumerService.consume(   
      'auth-service',
      { topic: 'api-auth-forget-password-req'},
      {
        eachMessage: async ({ message }) => {
          //const input = JSON.parse(message.value.toString());
          const result = await this.authService.forgetPassword(message.value.toString())
          console.log(result);
          await this.producerService.onModuleInit();
          await this.producerService.produce({
            topic: 'auth-api-forget-password-res',
            messages: [{value: JSON.stringify(result)}],// có thể lỗi ở đây
            timeout: 6000 // chỗ này chưa ổn
          });
          await this.producerService.onApplicationShutdown();
        },
      },
    );
    this.consumerService.onApplicationShutdown();
  }

  async onModuleInit() {
    await this.handleLogin();
    // await this.handleRegister();
    // await this.handleLogout();
    // await this.handleRefreshToken();
    // await this.handleForgetPassword();
  }

}

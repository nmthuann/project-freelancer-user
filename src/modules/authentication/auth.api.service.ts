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
    
  async waitProducer(groupId: string, topic: string){
    this.consumerService.consume(   
      groupId,
      {topic: topic},
      {
        eachMessage: async ({ message }) => {
          const input = JSON.parse(message.value.toString());
          //handle Login with Auth Service
          const result: object = await this.authService.login(input);
          await this.producerService.sendMessage('auth-api-login-res', result, 6000);
        }
      }
    )
  }

  // async handleLogin(){
  //   const message : any =  await this.consumerService.handleMessage<any>('auth-service', 'api-auth-login-req');
  //       const result = await this.authService.login(message);
  //       console.log("result", result);
  //       await this.producerService.sendMessage('api-auth-login-req', result, 6000);
  // }

  // async a(){
  //   this.consumerService.consume(
  //     'api-gateway',
  //     {topic: ''},
  //     {
  //       eachBatch: async ({ batch }) => {
  //         console.log(`Received batch of ${batch.messages.length} 
  //           messages from topic ${batch.topic},
  //           partition ${batch.partition}`);
        
  //         // Xử lý từng tin nhắn trong lô
  //         batch.messages.forEach((message) => {
  //           console.log(`Received message: ${message.value} with offset ${message.offset}`);
  //           // Xử lý tin nhắn ở đây
  //         });
  //       }
  //     }
  //   )
  // }

  async onModuleInit() {
    await this.waitProducer('auth-servic', 'api-auth-login-req')
    //await this.handleLogin();
    // await this.handleRegister();
    // await this.handleLogout();
    // await this.handleRefreshToken();
    // await this.handleForgetPassword();
  }

}



  // async handleLogin(){
  //   this.consumerService.consume(   
  //     'auth-service',
  //     { topic: 'api-auth-login-req'},
  //     {
  //       eachMessage: async ({ topic, partition, message }) => {
  //         const input = JSON.parse(message.value.toString());
  //         console.log({
  //           //source: 'create-consumer',
  //           partition: partition.toString(),
  //           topic: topic.toString(),
  //           input: input
  //         });

  //         // handle Login with Auth Service
  //         const result = await this.authService.login(input);
  //         console.log("lỗi",result);
  //         if (!result) 
  //         {
  //           await this.producerService.onModuleInit();
  //           await this.producerService.produce({
  //             topic: 'auth-api-login-res',
  //             messages: [{value: JSON.stringify('ERRORRRRRR')}],// có thể lỗi ở đây
  //             timeout: 6000 // chỗ này chưa ổn
  //           });
  //           await this.producerService.onApplicationShutdown();
  //         }
  //         await this.producerService.onModuleInit();
  //         await this.producerService.produce({
  //           topic: 'auth-api-login-res',
  //           messages: [{value: JSON.stringify(result)}],// có thể lỗi ở đây
  //           timeout: 6000 // chỗ này chưa ổn
  //         });
  //         await this.producerService.onApplicationShutdown();
  //       },
          
  //     },
  //   );
  //   await this.consumerService.onApplicationShutdown();
  // }
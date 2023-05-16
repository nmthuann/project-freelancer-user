import { Kafka, logLevel } from 'kafkajs';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ProducerService } from 'src/modules/kafka/producer.service';
import { ConsumerService } from 'src/modules/kafka/consumer.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AccountUserService } from '../account-users/accountUser.service';
import { ProfileDocumentService } from '../profile-document/profileDocument.service';

@Injectable()
export class AuthApiGatewayService {
  constructor(
    private producerService: ProducerService,
    private consumerService: ConsumerService,
    private authService: AuthService,
    private readonly accountUserService: AccountUserService,
    private readonly profildocumentService: ProfileDocumentService,
  ){}
  

  //   login
  async waitProducerForLogin(groupId: string, topic: string){
    this.consumerService.consume(   
      groupId,
      {topic: topic},
      {
        eachMessage: async ({ message }) => {
          const input = JSON.parse(message.value.toString());
          //handle Login with Auth Service
          const result = await this.authService.login(input);
          console.log("send the result: ", result);
          await this.producerService.sendMessage('auth-api-login-res', result, 60000);
        }
      }
    )
  }


  //  register
  async waitProducerForRegister(groupId: string, topic: string){
    this.consumerService.consume(   
      groupId,
      {topic: topic},
      {
        eachMessage: async ({ message }) => {
          const input = JSON.parse(message.value.toString());
          const result = await this.authService.registerUser(input);
          console.log("send the result: ", result);
          await this.producerService.sendMessage('auth-api-register-res', result, 60000);
        }
      }
    )
  }


  @EventPattern('api-auth-logout') // put in middleware
  handleLogout(data: any){
    console.log('api-auth-logout');
    this.authService.logout(data);
  }


   // create Information
  async handleCreateInformationUser(groupId: string, topic: string){
    this.consumerService.consume(   
      groupId,
      {topic: topic},
      {
        eachMessage: async ({ message }) => {
          const input = JSON.parse(message.value.toString());
          //handle Login with Auth Service
          const result = await this.profildocumentService.CreateProfile(input); //profile ~ infor
          console.log("send the result: ", result);
          await this.producerService.sendMessage('create-infor-res', result, 60000);
        }
      }
    )
  }


  // create Profile
  async handleCreateProfileUser(groupId: string, topic: string){
    this.consumerService.consume(   
      groupId,
      {topic: topic},
      {
        eachMessage: async ({ message }) => {
          const input = JSON.parse(message.value.toString());
          const result = await this.profildocumentService.CreateProfileDetail(input['email'], input); //profile ~ infor
          console.log("send the result: ", result);
          await this.producerService.sendMessage('create-profile-res', result, 60000);
        }
      }
    )
  }


  // get Users
  async handleGetUsers(groupId: string, topic: string){
    this.consumerService.consume(   
      groupId,
      {topic: topic},
      {
        eachMessage: async ({ message }) => {
          const input = JSON.parse(message.value.toString());
          console.log(input);
          const result = await this.accountUserService.getAccountUsers();
          console.log("send the result: ", result);
          await this.producerService.sendMessage('getUsers-res', result, 60000);
        }
      }
    )
  }


  // event get name of freelancer
  @MessagePattern('get-freelancer-name')
  async getName(email: any){
    //  get Email -> check
    /**
     * 1. email is invalid?
     * 2. check created profile?
     * 3. 
     */
    const findUser = await this.accountUserService.getAccountUserByEmail(email);
    if (findUser){
      const check = await this.profildocumentService.isCreatedProfile(email);
      if(!check) return "Fail"
      const freelancer = await this.profildocumentService.getProfileByEmail(email);
      const fullname = freelancer.first_name + ' ' + freelancer.last_name;
      return fullname;
    }
    return "Fail"
  }



  async onModuleInit() {
    //this.waitProducerForLogin('auth-service', 'api-auth-login-req');
    await this.waitProducerForRegister('auth-service', 'api-auth-register-req')
    // await this.handleCreateInformationUser('auth-service', 'create-infor-req');
    // await this.handleCreateProfileUser('auth-service', 'create-profile-req');
    // await this.handleGetUsers('auth-service', 'getUsers-req')
  }

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
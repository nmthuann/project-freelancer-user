import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccountUserService } from './modules/account-users/accountUser.service';
import { InformationUserService } from './modules/infor-users/inforUser.service';
import { ProfileUserService } from './modules/profile-users/profileUser.service';
import { ProfileDocumentService } from './modules/profile-document/profileDocument.service';
import { ProducerService } from './modules/kafka/producer.service';
import { ConsumerService } from './modules/kafka/consumer.service';

@Injectable()
export class AppService {
  constructor(

  ){}
  
  
 


  getHello(): string {
    return 'HELLO! THIS IS USER SERVICE!';
  }


  // async onModuleInit() {
  //   await this.handleCreateInformationUser('auth-service', 'create-infor-req');
  //   await this.handleCreateProfileUser('auth-service', 'create-profile-req');
  //   await this.handleGetUsers('auth-service', 'getUsers-req')
  // }
}


 // // create Information
  // async handleCreateInformationUser(groupId: string, topic: string){
  //   this.consumerService.consume(   
  //     groupId,
  //     {topic: topic},
  //     {
  //       eachMessage: async ({ message }) => {
  //         const input = JSON.parse(message.value.toString());
  //         //handle Login with Auth Service
  //         const result = await this.profildocumentService.CreateProfile(input); //profile ~ infor
  //         console.log("send the result: ", result);
  //         await this.producerService.sendMessage('create-infor-res', result, 60000);
  //       }
  //     }
  //   )
  // }


  // // create Profile
  // async handleCreateProfileUser(groupId: string, topic: string){
  //   this.consumerService.consume(   
  //     groupId,
  //     {topic: topic},
  //     {
  //       eachMessage: async ({ message }) => {
  //         const input = JSON.parse(message.value.toString());
  //         const result = await this.profildocumentService.CreateProfileDetail(input['email'], input); //profile ~ infor
  //         console.log("send the result: ", result);
  //         await this.producerService.sendMessage('create-profile-res', result, 60000);
  //       }
  //     }
  //   )
  // }


  // // get Users
  // async handleGetUsers(groupId: string, topic: string){
  //   this.consumerService.consume(   
  //     groupId,
  //     {topic: topic},
  //     {
  //       eachMessage: async ({ message }) => {
  //         const input = JSON.parse(message.value.toString());
  //         console.log(input);
  //         const result = await this.accountUserService.getAccountUsers();
  //         console.log("send the result: ", result);
  //         await this.producerService.sendMessage('getUsers-res', result, 60000);
  //       }
  //     }
  //   )
  // }


  // // event get name of freelancer
  // @MessagePattern('get-freelancer-name')
  // async getName(email: any){
  //   //  get Email -> check
  //   /**
  //    * 1. email is invalid?
  //    * 2. check created profile?
  //    * 3. 
  //    */
  //   const findUser = await this.accountUserService.getAccountUserByEmail(email);
  //   if (findUser){
  //     const check = await this.profildocumentService.isCreatedProfile(email);
  //     if(!check) return "Fail"
  //     const freelancer = await this.profildocumentService.getProfileByEmail(email);
  //     const fullname = freelancer.first_name + ' ' + freelancer.last_name;
  //     return fullname;
  //   }
  //   return "Fail"
  // }
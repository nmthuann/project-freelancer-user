// import { Controller, Get, Inject, Injectable, OnModuleDestroy, OnModuleInit, UseFilters } from '@nestjs/common';
// import { ClientKafka } from '@nestjs/microservices';

// @Injectable()
// export class AuthSubscriberService implements OnModuleInit, OnModuleDestroy {
//     constructor(
//         @Inject('AUTH_SERVICE') private readonly kafka: ClientKafka
//     ) {}

//     async onModuleInit() {[
//         'api-auth-login-req',
//         'api-auth-register-req',
//         'create-infor-req',
//         'create-profile-req',
//         'get-users-req'
//         ].forEach((key) => this.kafka.subscribeToResponseOf(key));
//     }

//   async onModuleDestroy() {
//     await this.kafka.close();
//   }
// }
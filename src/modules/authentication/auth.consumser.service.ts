import {
  ConsoleLogger,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import {
  Consumer,
  ConsumerConfig,
  ConsumerRunConfig,
  ConsumerSubscribeTopic,
  Kafka,
} from 'kafkajs';

@Injectable()
export class AuthConsumerService implements OnApplicationShutdown {
    

    private readonly kafka = new Kafka({
        brokers: ['localhost:9092'],
        //onnectionTimeout: 6000,
    });

    private readonly consumer: Consumer = this.kafka.consumer({ groupId: 'auth-service' });
  

  async shutdown() {
    await this.consumer.disconnect();
  }

  async subscribeResponse(topics: []){
    await this.consumer.subscribe({topics: topics});
  }

  async consume(config: ConsumerRunConfig) {
    await this.consumer.run(config);
  }


  async onApplicationShutdown() {
      await this.consumer.disconnect();
  }
  
  async connect(groupId: string){
    await this.consumer.connect().catch((e) => console.error(e));
  }

}



 
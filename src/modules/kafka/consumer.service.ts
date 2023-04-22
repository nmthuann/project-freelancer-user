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
export class ConsumerService implements OnApplicationShutdown {
    private readonly consumers: Consumer[] = [];

   private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    //onnectionTimeout: 6000,
  });

  async shutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  async consume(
    groupId: string, 
    topic: ConsumerSubscribeTopic, 
    config: ConsumerRunConfig,
  ) {
    const cosumer: Consumer = this.kafka.consumer({ groupId: groupId });
    await cosumer.connect().catch((e) => console.error(e));
    await cosumer.subscribe(topic);
    await cosumer.run(config);
    this.consumers.push(cosumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  async consumeSingle( 
    groupId: string, 
    topic: ConsumerSubscribeTopic, 
    config: ConsumerRunConfig,
  ) {
    const cosumer: Consumer = this.kafka.consumer({ groupId: groupId });
    await cosumer.connect().catch((e) => console.error(e));
    await cosumer.subscribe(topic);
    await cosumer.run(config);
  }
  
}


// async handleMessage <T>(groupId: string, resTopic: string): Promise<T>{
  //   return new Promise<T>((resolve, reject) => {
  //     try {
  //       this.consume(
  //         groupId,
  //         { topic: resTopic },
  //         {
  //           eachMessage: async ({ topic, partition, message }) => {
  //             const output = await JSON.parse(message.value.toString());
  //             console.log({
  //               //source: 'create-consumer',
  //               partition: partition.toString(),
  //               topic: topic.toString(),
  //               output: output
  //             });
  //             resolve(output);
  //           },
  //         }
  //       );
  //       // close connect consumer
  //       this.onApplicationShutdown();
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }


  // async a(){
  //   this.consume(
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
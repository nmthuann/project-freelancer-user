import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopic,
  Kafka,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: Consumer[] = [];

  private readonly kafka = new Kafka({
    clientId: 'auth-consumer',
    brokers: ['localhost:9092'],
    //onnectionTimeout: 6000,
  });

  async shutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  // async subscribeResponse(topis: Top){
  //   const consumer: Consumer = this.kafka.consumer({ groupId: groupId });
  //   await consumer.subscribe(topics);
  // }

  async consume(
    groupId: string,
    topic: ConsumerSubscribeTopic,
    config: ConsumerRunConfig,
  ) {
    const consumer: Consumer = this.kafka.consumer({ groupId: groupId });
    await consumer.connect().catch((e) => console.error(e));
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  // async consume(topic: ConsumerSubscribeTopic, config: ConsumerRunConfig) {
  //   let consumer: Consumer;
  //   await consumer.connect().catch((e) => console.error(e));
  //   await consumer.subscribe(topic);
  //   await consumer.run(config);
  //   this.consumers.push(consumer);
  // }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  async connect(groupId: string) {
    const consumer: Consumer = this.kafka.consumer({ groupId: groupId });
    await consumer.connect().catch((e) => console.error(e));
  }

  // async consume(
  //   topic: ConsumerSubscribeTopic,
  //   config: ConsumerRunConfig,
  // ) {
  //   const consumer: Consumer = this.kafka.consumer({ groupId: groupId });
  //   await consumer.connect().catch((e) => console.error(e));
  //   await consumer.subscribe({topics: [',', 'd']});
  //   await consumer.run(config);
  //   this.consumers.push(consumer);
  // }
}

// async consumeSingle(
//   groupId: string,
//   topic: ConsumerSubscribeTopic,
//   config: ConsumerRunConfig,
// ) {
//   const cosumer: Consumer = this.kafka.consumer({ groupId: groupId });
//   await cosumer.connect().catch((e) => console.error(e));
//   await cosumer.subscribe(topic);
//   await cosumer.run(config);
// }

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

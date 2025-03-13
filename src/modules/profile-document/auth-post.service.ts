import { Consumer, Kafka } from 'kafkajs';
import { Injectable } from '@nestjs/common';
import { ProducerService } from 'src/modules/kafka/producer.service';
import { ConsumerService } from 'src/modules/kafka/consumer.service';
import { ProfileDocumentService } from './profile-document.service';

@Injectable()
export class AuthPostService {
  // implements OnModuleInit

  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
    //onnectionTimeout: 6000,
  });

  private readonly consumer: Consumer = this.kafka.consumer({
    groupId: 'auth-service',
  });

  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
    private readonly profildocumentService: ProfileDocumentService,
  ) {}

  async handlePostServiceMessage(groupId: string, topic: string) {
    this.consumerService.consume(
      groupId,
      { topic: topic },
      {
        eachMessage: async ({ message }) => {
          const input = JSON.parse(message.value.toString());
          const result = await this.profildocumentService.getFreelancerName(
            input,
          );
          console.log('send the result: ', result);
          await this.producerService.sendMessage(
            'get-freelancer-name-res',
            result,
            6000,
          );
        },
      },
    );
  }

  async onModuleInit() {
    await this.handlePostServiceMessage('auth-service', 'get-freelancer-name');
  }
}

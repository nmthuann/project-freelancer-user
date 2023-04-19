import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  
  private readonly kafka = new Kafka({
    clientId: 'auth-consumer',
    brokers: ['localhost:9092'],
  });

  private readonly producer: Producer = this.kafka.producer();

  async produce(record: ProducerRecord) {
    return await this.producer.send(record);
  }
  async onModuleInit() {
    await this.producer.connect();
  }
  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
  
}
import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService  { //implements OnModuleInit, OnApplicationShutdown

  private readonly kafka = new Kafka({
    clientId: 'auth-producer',
    brokers: ['localhost:9092'],
  });

  private readonly producer: Producer = this.kafka.producer();

  async produce(record: ProducerRecord) {
    //return await this.producer.send(record);
    try {
      console.log(`Message sent to topic ${record.topic}: ${JSON.stringify(record.messages)}`);
      return await this.producer.send(record);
    } catch (err) {
      throw new Error(`Failed to send message to topic ${record.topic}: ${err.message}`);
    }
  }


  public async start(): Promise<void> {
    try {
      await this.producer.connect()
    } catch (error) {
      console.log('Error connecting the producer: ', error)
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect()
  }


  async sendMessage(topic: string, message: any, timeout: number){
    await this.start();
    await this.produce({
      topic: topic,
      messages: [{value: JSON.stringify(message)}],
      timeout: timeout,
    });
    await this.shutdown();
  }
  
}
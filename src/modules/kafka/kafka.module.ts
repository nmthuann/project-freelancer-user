import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Module({
  providers: [ProducerService], // ConsumerService,
  exports: [ProducerService], // ConsumerService,
})
export class KafkaModule {}

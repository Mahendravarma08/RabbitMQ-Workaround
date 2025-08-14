import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Exchanges, Queues } from './rbq.configs';

@Injectable()
export class RBQAnalytics implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  // You can configure these as needed or inject via config service
  private readonly RABBITMQ_URL = 'amqp://localhost';

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(this.RABBITMQ_URL, {
            clientProperties: {
                connection_name: 'Analytics consumer',
            }
        });
      this.channel = await this.connection.createChannel();

      // Bind Queue to Exchange with routing key
      await this.channel.bindQueue(Queues.Analytics, Exchanges.TOPIC_EXCHANGE,'*.notify.*'); 

      // Start consuming
      await this.channel.consume(Queues.Analytics, (msg) => {
        if (msg !== null) {
          const content = msg.content.toString();
          console.log(`Analytics Consumer received: ${content}`);
          for(let i=0;i<100000000;i++){
            continue
          }

          // Acknowledge message after processing
          this.channel.ack(msg);
        }
      });

      console.log('RabbitMQ consumer started successfully');
    } catch (error) {
      console.error('Failed to initialize RabbitMQ', error);
    }
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
    console.log('RabbitMQ connection closed');
  }
}

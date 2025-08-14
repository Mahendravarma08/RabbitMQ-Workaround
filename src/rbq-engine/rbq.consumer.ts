import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Exchanges, Queues, RoutingKeys } from './rbq.configs';

@Injectable()
export class RBQConsumer implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  async onModuleInit() {
    try {
      this.connection = await amqp.connect('amqp://localhost', {
        clientProperties: {
          connection_name: 'RBQConsumer',
        }
      });
      this.channel = await this.connection.createChannel();

      // Bind Queue to Exchange with routing key
      // await this.channel.bindQueue(Queues.Orders, Exchanges.DIRECT_EXCHANGE, RoutingKeys.ORDERS_ROUTING_KEY);

      // Start consuming
      await this.channel.consume(Queues.Orders, (msg) => {
        if (msg !== null) {
          const content = msg.content.toString();
          console.log(`Received message in rbq consumer file: ${content}`);
          for (let i = 0; i < 100000000; i++) {
            continue
          }

          // Acknowledge message after processing
          this.channel.ack(msg);
        }
      });

      // await this.channel.consume(Queues.Notifications, (msg) => {
      //   if (msg !== null) {
      //     const content = msg.content.toString();
      //     console.log(`Received message in notification consumer inside rbqConsumer: ${content}`);
      //     for (let i = 0; i < 1000000000; i++) {
      //       continue
      //     }

      //     // Acknowledge message after processing
      //     this.channel.ack(msg);
      //   }
      // });

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

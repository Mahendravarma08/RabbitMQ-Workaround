import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RBQProducer implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://localhost', {
      clientProperties: {
        connection_name: 'RBQProducer',
      }
    });
    this.channel = await this.connection.createChannel();
  }

  async produceDirectExchangeMessages(exchange: string, routingKey: string, data: any) {
    await this.channel.assertExchange(exchange, 'direct', { durable: true });
    const bufferMessage = Buffer.from(JSON.stringify(data));
    this.channel.publish(exchange, routingKey, bufferMessage);
    console.log(`Message sent to exchange "${exchange}" with routing key "${routingKey}"`);
  }

  async producerFanoutMessages(exchange: string, data: any) {
    await this.channel.assertExchange(exchange, 'fanout', { durable: true });
    const bufferMessage = Buffer.from(JSON.stringify(data));
    this.channel.publish(exchange, '', bufferMessage);
  }

  async produceTopicMessages(exchange: string,routingKey, data: any) {
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    const bufferMessage = Buffer.from(JSON.stringify(data));
    this.channel.publish(exchange, routingKey, bufferMessage);
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Exchanges, Queues, RoutingKeys, Exchange_type } from './rbq.configs';
import * as amqp from 'amqplib';
import { queue } from 'rxjs';

@Injectable()
export class RBQInitialization implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.Connection;
    private channel: amqp.Channel;

    async onModuleInit() {
        try {
            this.connection = await amqp.connect('amqp://localhost', {
                clientProperties: {
                    connection_name: 'Initialization',
                }
            });
            this.channel = await this.connection.createChannel();
            // Direct exchange
            await this.channel.assertExchange(Exchanges.DIRECT_EXCHANGE, Exchange_type.DIRECT, { durable: true });
            await this.channel.assertQueue(Queues.Orders, { durable: true });
            // await this.channel.bindQueue(Queues.Orders, Exchanges.DIRECT_EXCHANGE, RoutingKeys.ORDERS_ROUTING_KEY);
            // await this.channel.bindQueue(Queues.Orders, Exchanges.FANOUT_EXCHANGE);

            //
            await this.channel.assertExchange(Exchanges.FANOUT_EXCHANGE, Exchange_type.FANOUT, { durable: true })
            await this.channel.assertQueue(Queues.Notifications, { durable: true })
            // await this.channel.bindQueue(Queues.Notifications, Exchanges.FANOUT_EXCHANGE,'')
            console.log('RabbitMQ setup complete: Exchange, Queue, and Binding declared.');

            await this.channel.assertExchange(Exchanges.TOPIC_EXCHANGE, Exchange_type.TOPIC, { durable: true })
            await this.channel.assertQueue(Queues.Analytics, { durable: true });
            await this.channel.assertQueue(Queues.Invoice, { durable: true });


        }
        catch (err) {
            console.log(err)
        }
    }

    async onModuleDestroy() {
        await this.channel?.close();
        await this.connection?.close();
        console.log('RabbitMQ connection closed.');
    }

    // Optionally expose channel if you want to publish messages here or in other services
    getChannel(): amqp.Channel {
        return this.channel;
    }
}

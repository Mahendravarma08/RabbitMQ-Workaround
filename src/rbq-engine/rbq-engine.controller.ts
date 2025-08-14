import { Body, Controller, Post } from '@nestjs/common';
import { RBQProducer } from './rbq.producer';
import { Exchange_type, Exchanges, Queues, RoutingKeys } from './rbq.configs';

@Controller('rbq-engine')
export class RbqEngineController {
    constructor(private readonly RBQProducer: RBQProducer) {
        console.log("constructor Initialized in rbq controller..")
    }

    @Post('postDirectMessage')
    async postMessage(@Body() body) {
        for (let i = 0; i < body.frequency; i++) {
            this.RBQProducer.produceDirectExchangeMessages(Exchanges.DIRECT_EXCHANGE, Queues.Orders, { Name: body.name, Age: body.age, frequencyNumber: i });
        }
    }

    @Post('postFanoutMessage')
    async postFanoutMessage(@Body() body) {
        for (let i = 0; i < body.frequency; i++) {
            this.RBQProducer.producerFanoutMessages(Exchanges.FANOUT_EXCHANGE, { Name: body.name, Age: body.age, frequencyNumber: i });
        }
    }

    @Post('postTopicMessage')
    async postTopicMessage(@Body() body) {
        for (let i = 0; i < body.frequency; i++) {
            this.RBQProducer.produceTopicMessages(Exchanges.TOPIC_EXCHANGE,RoutingKeys.ORDER_PLACED_NOTIFY_ROUTING_KEY, { Name: body.name, Age: body.age, frequencyNumber: i });
        }
    }
}

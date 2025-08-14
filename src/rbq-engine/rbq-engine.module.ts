import { Module } from '@nestjs/common';
import { RbqEngineController } from './rbq-engine.controller';
import { RBQProducer } from './rbq.producer';
import { RBQConsumer } from './rbq.consumer';
import { RBQInitialization } from './rbq-engine.initialization';
import { RBQNotificationConsumer } from './rbq-notifications.consumer';
import { RBQAnalytics } from './rbq-analytics.consumer';
import { RBQInvoice } from './rbq-invoice.consumer';

@Module({
  controllers: [RbqEngineController],
  providers: [RBQInitialization, RBQProducer, RBQConsumer,RBQNotificationConsumer,RBQAnalytics,RBQInvoice]
})
export class RbqEngineModule { }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RbqEngineModule } from './rbq-engine/rbq-engine.module';

@Module({
  imports: [RbqEngineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

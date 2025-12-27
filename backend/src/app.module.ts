import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphModule } from './graph/graph.module';
import { RoutingModule } from './routing/routing.module';

@Module({
  imports: [GraphModule, RoutingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

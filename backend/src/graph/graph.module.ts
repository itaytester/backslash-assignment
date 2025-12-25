import { Module } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { GraphService } from './graph.service';

@Module({
  providers: [GraphService, RoutingService],
  exports: [GraphService, RoutingService],
})
export class GraphModule {}

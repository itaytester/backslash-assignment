import { Controller, Get, Query } from '@nestjs/common';
import { GraphService } from './graph/graph.service';
import { RoutingService } from './routing/routing.service';
import { type GraphResponse } from './graph/graph.types';
import { GetGraphQueryDto } from './dto/get-graph.query.dto';

@Controller()
export class AppController {
  constructor(
    private readonly graphService: GraphService,
    private readonly routingService: RoutingService,
  ) {}

  @Get('/graph')
  getHello(@Query() query: GetGraphQueryDto): GraphResponse {
    const routes = this.routingService.findAllRoutes(
      Array.from(this.graphService.getAllNodes().values()),
      this.graphService.getAdjacencies(),
    );

    const filteredRoutes = this.routingService.getFilteredRoutes(
      routes,
      query.filter ?? [],
      this.graphService.getAllNodes(),
    );

    return this.graphService.getGraphBasedOnRoutes(filteredRoutes);
  }
}

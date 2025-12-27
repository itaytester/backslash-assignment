import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { GraphService } from './graph.service';
import { GraphRepository } from './repositories/graph.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: Joi.object({
        GRAPH_FILE_PATH: Joi.string(),
      }),
      envFilePath: '../.env',
    }),
  ],
  providers: [GraphService, GraphRepository],
  exports: [GraphService],
})
export class GraphModule {}

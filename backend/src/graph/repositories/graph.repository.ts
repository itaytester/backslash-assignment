import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import { buildGraphFromRaw } from '../graph.utils';
import { RawGraph } from '../graph.types';

@Injectable()
export class GraphRepository {
  private readonly logger = new Logger(GraphRepository.name);

  constructor(private readonly configService: ConfigService) {}

  loadGraph() {
    const graphFilePath =
      this.configService.get<string>('GRAPH_FILE_PATH') ?? 'src/graph.json';
    const filePath = path.join(process.cwd(), graphFilePath);

    this.logger.log(`Loading graph from: ${filePath}`);

    const fileContent = this.readFile(filePath);
    const raw = this.parseJson(fileContent);
    const graph = this.buildGraph(raw);

    this.logger.log(`Graph loaded from file`);
    return graph;
  }

  private readFile(filePath: string) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      const fsError = error as NodeJS.ErrnoException;
      this.logger.error(`Failed to read graph file: ${fsError.message}`);
      throw new Error(
        `Failed to read graph file at ${filePath}: ${fsError.code}`,
      );
    }
  }

  private parseJson(content: string) {
    try {
      return JSON.parse(content) as RawGraph;
    } catch {
      this.logger.error('Failed to parse graph JSON');
      throw new Error('Graph file contains invalid JSON');
    }
  }

  private buildGraph(raw: RawGraph) {
    try {
      return buildGraphFromRaw(raw);
    } catch (error) {
      const buildError = error as Error;
      this.logger.error(`Failed to build graph: ${buildError.message}`);
      throw new Error(`Failed to build graph: ${buildError.message}`);
    }
  }
}

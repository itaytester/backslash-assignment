/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { FilterName } from 'src/graph/graph.filters';

export class GetGraphQueryDto {
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }: { value: unknown }) => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') return value.split(',');
    return [];
  })
  filter?: FilterName[];
}

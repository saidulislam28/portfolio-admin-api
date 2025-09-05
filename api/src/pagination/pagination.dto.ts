import { Transform } from 'class-transformer';

export class PaginationQuery {
  @Transform(({ value }) => Number(value))
  page: number;
  @Transform(({ value }) => Number(value))
  limit: number;
}

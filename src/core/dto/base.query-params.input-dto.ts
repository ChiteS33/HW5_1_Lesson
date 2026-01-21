import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class InputPaginationType {
  @IsOptional()
  @IsString()
  pageNumber?: string;
  @IsOptional()
  @IsNumber()
  pageSize?: string;
  @IsOptional()
  @IsString()
  sortBy?: string;
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}

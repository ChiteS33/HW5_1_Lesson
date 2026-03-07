import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortDirection } from './enumSortDirection.type';

export class inPutValidationPagination {
  @IsOptional()
  @IsString()
  sortBy?: string;
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
  @IsOptional()
  @IsString()
  pageNumber?: string;
  @IsOptional()
  @IsString()
  pageSize?: string;
}

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortDirection } from '../types/enumSortDirection.type';

export class InputQueryPaginationTypeWithSearchName {
  @IsOptional()
  @IsString()
  searchNameTerm?: string;
  @IsOptional()
  @IsString()
  pageNumber?: string;
  @IsOptional()
  @IsString()
  pageSize?: string;
  @IsOptional()
  @IsString()
  sortBy?: string;
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}

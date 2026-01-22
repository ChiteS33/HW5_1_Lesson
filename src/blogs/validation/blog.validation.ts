import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortDirection } from '../../core/dto/base.query-params.input-dto';

export class InputPaginationWithSearchName {
  @IsOptional()
  @IsOptional()
  searchNameTerm?: string;
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

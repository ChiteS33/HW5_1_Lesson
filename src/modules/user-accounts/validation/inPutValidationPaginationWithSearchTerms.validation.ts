import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortDirection } from '../../../core/types/enumSortDirection.type';

export class inPutValidationPaginationWithSearchTerms {
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
  @IsOptional()
  @IsString()
  searchLoginTerm?: string;
  @IsOptional()
  @IsString()
  searchEmailTerm?: string;
}

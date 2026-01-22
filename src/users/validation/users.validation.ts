import { SortDirection } from '../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class InPutPaginationWithSearchLoginTermAndSearchEMailTerm {
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
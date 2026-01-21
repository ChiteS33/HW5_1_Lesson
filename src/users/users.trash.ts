import {
  FinalWithPaginationType,
  OutPutPaginationType,
} from '../blogs/blogs.trash';
import { UserOutPut } from './repositories/users.queryRepository';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortDirection } from '../core/dto/base.query-params.input-dto';

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

export type PaginationWithSearchLoginTermAndSearchEMailTermForRepo = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string;
  searchEmailTerm: string;
};

export const valuesMakerWithSearchLoginAndEmail = (
  query: InPutPaginationWithSearchLoginTermAndSearchEMailTerm,
): PaginationWithSearchLoginTermAndSearchEMailTermForRepo => {
  return {
    sortBy: query.sortBy ?? 'createdAt',
    sortDirection: query.sortDirection ?? SortDirection.DESC,
    pageNumber: query.pageNumber ? Number(query.pageNumber) : 1,
    pageSize: query.pageSize ? Number(query.pageSize) : 10,
    searchLoginTerm: query.searchLoginTerm ?? '',
    searchEmailTerm: query.searchEmailTerm ?? '',
  };
};

export const outPutPaginationUserMapper = (
  dto: UserOutPut[],
  params: OutPutPaginationType,
): FinalWithPaginationType<UserOutPut> => {
  return {
    pagesCount: params.pagesCount,
    page: params.page,
    pageSize: params.pageSize,
    totalCount: params.totalCount,
    items: dto,
  };
};

import { SortDirection } from '../../core/dto/base.query-params.input-dto';

export type PaginationForRepoWithSearchName = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export type BlogOutPutType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type OutPutPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
};

export type FinalWithPaginationType<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

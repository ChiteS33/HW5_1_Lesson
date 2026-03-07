import { SortDirection } from './enumSortDirection.type';

export type PaginationWithSearchLoginTermAndSearchEMailTermForRepo = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string;
  searchEmailTerm: string;
};

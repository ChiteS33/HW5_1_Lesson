import { SortDirection } from './enumSortDirection.type';

export type PaginationForRepoWithSearchName = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

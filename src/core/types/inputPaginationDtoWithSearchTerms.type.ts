import { SortDirection } from './enumSortDirection.type';

export type InPutPaginationWithSearchLoginTermAndSearchEMailTerm = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: string;
  pageSize?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

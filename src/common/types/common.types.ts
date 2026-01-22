import { SortDirection } from '../../core/dto/base.query-params.input-dto';

export type PaginationWithSearchLoginTermAndSearchEMailTermForRepo = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string;
  searchEmailTerm: string;
};

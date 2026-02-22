import { SortDirection } from '../../core/dto/base.query-params.input-dto';

export type UserOutPut = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type InPutPaginationWithSearchLoginTermAndSearchEMailTerm = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: string;
  pageSize?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

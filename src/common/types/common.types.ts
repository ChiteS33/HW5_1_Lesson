import { SortDirection } from '../../core/dto/base.query-params.input-dto';

export type PaginationWithSearchLoginTermAndSearchEMailTermForRepo = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string;
  searchEmailTerm: string;
};

export type Payload = {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
};

export type TotalCount = {
  count: number;
};

export type Id = {
  id: number;
};

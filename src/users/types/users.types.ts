import { SortDirection } from '../../core/dto/base.query-params.input-dto';

export type UserInDB = {
  id: number;
  login: string;
  email: string;
  createdAt: Date;
  passwordHash: string;
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
  recoveryCode: string;
};

export type UserOutPut = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  passwordHash?: string;
  confirmationCode?: string;
  expirationDate?: Date;
  isConfirmed?: boolean;
  recoveryCode?: string;
};

export type UserInPut = {
  id: number;
  login: string;
  email: string;
  createdAt: Date;
};

export type InPutPaginationWithSearchLoginTermAndSearchEMailTerm = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: string;
  pageSize?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

import {
  InputPaginationType,
  SortDirection,
} from '../../core/dto/base.query-params.input-dto';
import { InputPaginationWithSearchName } from '../../blogs/validation/blog.validation';
import { PaginationForRepoWithSearchName } from '../../blogs/types/blog.types';
import { PaginationWithSearchLoginTermAndSearchEMailTermForRepo } from '../types/common.types';
import { InPutPaginationWithSearchLoginTermAndSearchEMailTerm } from '../../users/validation/users.validation';

export const paginationValuesMakerWithSearch = (
  query: InputPaginationWithSearchName,
): PaginationForRepoWithSearchName => {
  return {
    searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection
      ? query.sortDirection
      : SortDirection.DESC,
    pageNumber: query.pageNumber ? Number(query.pageNumber) : 1,
    pageSize: query.pageSize ? Number(query.pageSize) : 10,
  };
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

export const paginationValuesMaker = (pagination: InputPaginationType) => {
  return {
    pageNumber: pagination.pageNumber ? Number(pagination.pageNumber) : 1,
    pageSize: pagination.pageSize ? Number(pagination.pageSize) : 10,
    sortBy: pagination.sortBy ? pagination.sortBy : 'createdAt',
    sortDirection: pagination.sortDirection
      ? pagination.sortDirection
      : SortDirection.DESC,
  };
};

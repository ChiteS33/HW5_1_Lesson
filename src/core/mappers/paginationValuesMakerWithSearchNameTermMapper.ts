import { PaginationForRepoWithSearchName } from '../types/paginationDtoWithSearchNameForRepo.type';
import { SortDirection } from '../types/enumSortDirection.type';
import { InputQueryPaginationTypeWithSearchName } from '../pagination/inputQueryPaginationTypeWithSearchName';

export const paginationValuesMakerWithSearchNameTermMapper = (
  query: InputQueryPaginationTypeWithSearchName,
): PaginationForRepoWithSearchName => {
  return {
    searchNameTerm: query.searchNameTerm ?? '',
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection
      ? query.sortDirection
      : SortDirection.DESC,
    pageNumber: query.pageNumber ? Number(query.pageNumber) : 1,
    pageSize: query.pageSize ? Number(query.pageSize) : 10,
  };
};

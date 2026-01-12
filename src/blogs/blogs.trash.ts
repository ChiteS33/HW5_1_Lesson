import { BlogDocument } from './blogs.entity';

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

export type InputPaginationType = {
  pageNumber?: string;
  pageSize?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
};

export type InputPaginationWithSearchName = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: string;
  pageSize?: string;
};

export type PaginationForRepoWithSearchName = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

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

export const blogMapper = (blog: BlogDocument): BlogOutPutType => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
  };
};
export const finalPaginationWithBlogValue = (
  blogValues: BlogOutPutType[],
  paginationValues: OutPutPaginationType,
): FinalWithPaginationType<BlogOutPutType> => {
  return {
    pagesCount: paginationValues.pagesCount,
    page: paginationValues.page,
    pageSize: paginationValues.pageSize,
    totalCount: paginationValues.totalCount,
    items: blogValues,
  };
};

import { BlogDocument } from '../blogs.entity';
import {
  BlogOutPutType,
  FinalWithPaginationType,
  OutPutPaginationType,
} from '../types/blog.types';

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

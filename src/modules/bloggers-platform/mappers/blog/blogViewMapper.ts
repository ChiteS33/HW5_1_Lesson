import { BlogEntityType } from '../../repositories/entity-types/blogEntity.type';
import { BlogViewType } from '../../api/view-types/blogs/blogView.type';

export const blogViewMapper = (blog: BlogEntityType): BlogViewType => {
  return {
    id: blog.id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
  };
};

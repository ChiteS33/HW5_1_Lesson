import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogDocument, BlogModel, BlogModelI } from './blogs.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  blogMapper,
  BlogOutPutType,
  finalPaginationWithBlogValue,
  FinalWithPaginationType,
  InputPaginationType,
  OutPutPaginationType,
  paginationValuesMakerWithSearch,
} from './blogs.trash';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(BlogModel.name) private blogsModel: BlogModelI) {}

  async getAllBlogs(
    query: InputPaginationType,
  ): Promise<FinalWithPaginationType<BlogOutPutType>> {
    const pagination = paginationValuesMakerWithSearch(query);
    const limit = pagination.pageSize;
    const sort = {
      [pagination.sortBy]: pagination.sortDirection,
    };
    const skip =
      pagination.pageSize * pagination.pageNumber - pagination.pageSize;
    const search = pagination.searchNameTerm
      ? {
          name: {
            $regex: pagination.searchNameTerm,
            $options: 'i',
          },
        }
      : {};

    const foundedBlogs: BlogDocument[] = await this.blogsModel
      .find(search)
      .skip(skip)
      .limit(limit)
      .sort(sort);
    const totalCount = await this.blogsModel.countDocuments(search);
    const params: OutPutPaginationType = {
      pagesCount: Math.ceil(totalCount / limit),
      page: pagination.pageNumber,
      pageSize: limit,
      totalCount: totalCount,
    };
    return finalPaginationWithBlogValue(foundedBlogs.map(blogMapper), params);
  }

  async getBlogById(blogId: string): Promise<BlogOutPutType> {
    const foundBlog = await this.blogsModel.findOne({ _id: blogId });
    if (!foundBlog) throw new NotFoundException();
    return blogMapper(foundBlog);
  }
}

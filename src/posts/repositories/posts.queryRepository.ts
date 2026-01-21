import { Inject, Injectable } from '@nestjs/common';
import { PostModel, PostModelI } from '../posts.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  FinalWithPaginationType,
  OutPutPaginationType,
} from '../../blogs/blogs.trash';
import {
  finalPaginationWithPostValue,
  paginationValuesMaker,
  postMapper,
  PostOutPutType,
} from '../posts.trash';
import { BlogsService } from '../../blogs/blogs.service';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { InputPaginationType } from '../../core/dto/base.query-params.input-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(PostModel.name) private postModel: PostModelI,
    @Inject(BlogsService) private blogsService: BlogsService,
  ) {}

  async findAllPosts(
    pagination: InputPaginationType,
  ): Promise<FinalWithPaginationType<PostOutPutType>> {
    const paginationValues = paginationValuesMaker(pagination);
    const limit = paginationValues.pageSize;
    const skip =
      paginationValues.pageSize * paginationValues.pageNumber -
      paginationValues.pageSize;
    const sort = { [paginationValues.sortBy]: paginationValues.sortDirection };
    const foundedPosts = await this.postModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const totalCount = await this.postModel.countDocuments();
    const paginationForFront: OutPutPaginationType = {
      pagesCount: Math.ceil(totalCount / paginationValues.pageSize),
      page: paginationValues.pageNumber,
      pageSize: limit,
      totalCount: totalCount,
    };

    const postsForFront: PostOutPutType[] = foundedPosts.map(postMapper);
    return finalPaginationWithPostValue(postsForFront, paginationForFront);
  }
  async findPostByPostId(postId: string): Promise<PostOutPutType> {
    const foundPost = await this.postModel.findById({ _id: postId });
    if (!foundPost) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'postId',
        message: 'Post not found',
      });
    }
    return postMapper(foundPost);
  }
  async findAllPostsByBlogId(
    blogId: string,
    pagination: InputPaginationType,
  ): Promise<FinalWithPaginationType<PostOutPutType>> {
    await this.blogsService.findBlogById(blogId);
    const paginationValues = paginationValuesMaker(pagination); // сделали значения для пагниации (дефолтные)
    const limit = paginationValues.pageSize;
    const skip =
      paginationValues.pageSize * paginationValues.pageNumber -
      paginationValues.pageSize;
    const sort = {
      [paginationValues.sortBy]: paginationValues.sortDirection,
    };
    const foundPosts = await this.postModel
      .find({ blogId: blogId })
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const totalCount = await this.postModel.countDocuments({ blogId: blogId });
    const paginationForFront: OutPutPaginationType = {
      pagesCount: Math.ceil(totalCount / paginationValues.pageSize),
      page: paginationValues.pageNumber,
      pageSize: limit,
      totalCount: totalCount,
    };
    const postsForFront: PostOutPutType[] = foundPosts.map(postMapper);
    return finalPaginationWithPostValue(postsForFront, paginationForFront);
  }
}

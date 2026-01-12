import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CommentDocument,
  CommentModel,
  CommentModelI,
} from './comments.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostsRepository } from '../posts/posts.repository';
import {
  FinalWithPaginationType,
  InputPaginationType,
} from '../blogs/blogs.trash';
import {
  CommentOutPutType,
  commentsFinalMapperWithCount,
  finalCommentsMapperWithPago,
} from './comments.trash';
import { paginationValuesMaker } from '../posts/posts.trash';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly commentModel: CommentModelI,
    @Inject(PostsRepository) private readonly postsRepository: PostsRepository,
  ) {}

  async getCommentById(commentId: string): Promise<CommentDocument | null> {
    return this.commentModel.findById(commentId);
  }

  async getAllCommentsByPostId(
    postId: string,
    pagination: InputPaginationType,
  ): Promise<FinalWithPaginationType<CommentOutPutType>> {
    const foundedPost = await this.postsRepository.findPostsById(postId);
    if (!foundedPost) throw new NotFoundException();

    const paginationValues = paginationValuesMaker(pagination);
    const search = { postId: postId };
    const limit = paginationValues.pageSize;
    const skip =
      paginationValues.pageSize * paginationValues.pageNumber -
      paginationValues.pageSize;
    const sort = {
      [paginationValues.sortBy]: paginationValues.sortDirection,
    };
    const foundComments = await this.commentModel
      .find(search)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const totalCount = await this.commentModel.countDocuments({
      postId: postId,
    });
    const paginationForFront = {
      pagesCount: Math.ceil(totalCount / paginationValues.pageSize),
      page: paginationValues.pageNumber,
      pageSize: limit,
      totalCount: totalCount,
    };
    const readyComments = foundComments.map(commentsFinalMapperWithCount);
    return finalCommentsMapperWithPago(readyComments, paginationForFront);
  }
}

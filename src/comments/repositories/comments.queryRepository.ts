import { Inject, Injectable } from '@nestjs/common';
import { CommentModel, CommentModelI } from '../comments.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { InputPaginationType } from '../../core/dto/base.query-params.input-dto';
import { CommentOutPutType } from '../types/comments.types';
import { FinalWithPaginationType } from '../../blogs/types/blog.types';
import {
  commentsFinalMapperWithCount,
  finalCommentsMapperWithPago,
} from '../mappers/comments.mappers';
import { paginationValuesMaker } from '../../common/mappers/common.mappers';
import {
  LikeForCommentsModel,
  LikeForCommentsModelI,
} from '../../likes/likesForComments/comment.likes.entity';
import { LikeDislikeStatus } from '../../posts/posts.entity';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly commentModel: CommentModelI,
    @InjectModel(LikeForCommentsModel.name)
    private readonly likeModel: LikeForCommentsModelI,
    @Inject(PostsRepository)
    private readonly postsRepository: PostsRepository,
  ) {}

  async findCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentOutPutType | null> {
    const totalCountLike = await this.likeModel.countDocuments({
      commentId,
      status: 'Like',
    });
    const totalCountDislike = await this.likeModel.countDocuments({
      commentId,
      status: 'Dislike',
    });
    let myStatus: LikeDislikeStatus = LikeDislikeStatus.none;
    const foundComment = await this.commentModel.findById(commentId);
    if (!foundComment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'commentId',
        message: 'Comment not found',
      });
    }
    if (userId === null) {
      return commentsFinalMapperWithCount(
        foundComment,
        totalCountLike,
        totalCountDislike,
        myStatus,
      );
    }

    const foundLikeForComment = await this.likeModel.findOne({
      commentId,
      userId,
    });
    if (!foundLikeForComment) {
      return commentsFinalMapperWithCount(
        foundComment,
        totalCountLike,
        totalCountDislike,
        myStatus,
      );
    }
    myStatus = foundLikeForComment.status;
    return commentsFinalMapperWithCount(
      foundComment,
      totalCountLike,
      totalCountDislike,
      myStatus,
    );
  }

  async findAllCommentsByPostId(
    postId: string,
    pagination: InputPaginationType,
    userId?: string,
  ): Promise<FinalWithPaginationType<CommentOutPutType>> {
    const foundedPost = await this.postsRepository.findPostsById(postId);
    if (!foundedPost) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'postId',
        message: 'Post not found',
      });
    }

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

    const mappedCommentsPromises = foundComments.map((comment) => {
      return this.findCommentById(comment._id.toString(), userId);
    });
    const mappedComments = await Promise.all(mappedCommentsPromises);
    const commentsWithLikes = mappedComments.map((comment) => {
      return comment!;
    });

    const totalCount = await this.commentModel.countDocuments({
      postId: postId,
    });
    const paginationForFront = {
      pagesCount: Math.ceil(totalCount / paginationValues.pageSize),
      page: paginationValues.pageNumber,
      pageSize: limit,
      totalCount: totalCount,
    };

    return finalCommentsMapperWithPago(commentsWithLikes, paginationForFront);
  }
}

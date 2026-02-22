import { Inject, Injectable } from '@nestjs/common';
import { PostModel, PostModelI } from '../posts.entity';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsService } from '../../blogs/blogs.service';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { InputPaginationType } from '../../core/dto/base.query-params.input-dto';
import {
  FinalWithPaginationType,
  OutPutPaginationType,
} from '../../blogs/types/blog.types';
import { PostOutPutType } from '../types/posts.types';
import {
  finalPaginationWithPostValue,
  outPutMapperForPostWithNewestLikes,
} from '../mappers/posts.mappers';
import { paginationValuesMaker } from '../../common/mappers/common.mappers';
import {
  LikeForPostModel,
  LikeForPostModelI,
} from '../../likes/likesForPosts/post.likes.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(PostModel.name) private postModel: PostModelI,
    @InjectModel(LikeForPostModel.name) private likeModel: LikeForPostModelI,
    @Inject(BlogsService) private blogsService: BlogsService,
  ) {}

  async findAllPosts(
    pagination: InputPaginationType,
    userId?: string,
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
    const mappedPostsPromises = foundedPosts.map((post) => {
      return this.findPostByPostId(post._id.toString(), userId);
    });

    const mappedPosts = await Promise.all(mappedPostsPromises);
    const postsWithLikes = mappedPosts.map((post) => {
      return post;
    });

    const totalCount = await this.postModel.countDocuments();
    const paginationForFront: OutPutPaginationType = {
      pagesCount: Math.ceil(totalCount / paginationValues.pageSize),
      page: paginationValues.pageNumber,
      pageSize: limit,
      totalCount: totalCount,
    };

    return finalPaginationWithPostValue(postsWithLikes, paginationForFront);
  }
  async findPostByPostId(
    postId: string,
    userId?: string,
  ): Promise<PostOutPutType> {
    const totalCountLike = await this.likeModel.countDocuments({
      postId: postId,
      status: 'Like',
    });
    const totalDislike = await this.likeModel.countDocuments({
      postId: postId,
      status: 'Dislike',
    });
    let myStatus = 'None';
    const foundPost = await this.postModel.findById({ _id: postId });
    if (!foundPost) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'postId',
        message: 'Post not found',
      });
    }
    const newestLikesForPost = await this.likeModel
      .find({ postId: postId, status: 'Like' })
      .sort({ data: -1 })
      .limit(3);

    if (userId === null) {
      return outPutMapperForPostWithNewestLikes(
        foundPost,
        totalCountLike,
        totalDislike,
        myStatus,
        newestLikesForPost,
      );
    }

    const foundLikeForPost = await this.likeModel.findOne({ postId, userId });

    if (!foundLikeForPost) {
      return outPutMapperForPostWithNewestLikes(
        foundPost,
        totalCountLike,
        totalDislike,
        myStatus,
        newestLikesForPost,
      );
    }
    myStatus = foundLikeForPost.status;
    return outPutMapperForPostWithNewestLikes(
      foundPost,
      totalCountLike,
      totalDislike,
      myStatus,
      newestLikesForPost,
    );
  }
  async findAllPostsByBlogId(
    blogId: string,
    pagination: InputPaginationType,
    userId?: string,
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

    const mappedPostsPromises = foundPosts.map((post) => {
      return this.findPostByPostId(post._id.toString(), userId);
    });
    const mappedPosts = await Promise.all(mappedPostsPromises);
    const postsWithLikes = mappedPosts.map((post) => {
      return post;
    });

    const totalCount = await this.postModel.countDocuments({ blogId: blogId });
    const paginationForFront: OutPutPaginationType = {
      pagesCount: Math.ceil(totalCount / paginationValues.pageSize),
      page: paginationValues.pageNumber,
      pageSize: limit,
      totalCount: totalCount,
    };

    return finalPaginationWithPostValue(postsWithLikes, paginationForFront);
  }
}

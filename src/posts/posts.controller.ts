import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsQueryRepository } from './posts.queryRepository';
import { PostInputDtoForCreate } from './posts.entity';
import { PostService } from './posts.service';
import { CommentsQueryRepository } from '../comments/comments.queryRepository';
import { InputPaginationType } from '../blogs/blogs.trash';
import { DomainException } from '../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
    @Inject(PostService) private postService: PostService,
    @Inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id/comments')
  async getAllCommentsByPostId(
    @Param('id') postId: string,
    @Query() pagination: InputPaginationType,
  ) {
    await this.postService.findPostById(postId);
    return this.commentsQueryRepository.getAllCommentsByPostId(
      postId,
      pagination,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllPosts(@Query() query: InputPaginationType) {
    return this.postsQueryRepository.findAllPosts(query);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createPost(@Body() postInputDto: PostInputDtoForCreate) {
    const createdPostId = await this.postService.createPost(postInputDto);
    return this.postsQueryRepository.findPostByPostId(createdPostId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getPostById(@Param('id') postId: string) {
    const foundedPost =
      await this.postsQueryRepository.findPostByPostId(postId);
    if (!foundedPost) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'postId',
        message: 'Post not found',
      });
    }
    return foundedPost;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updatePostById(
    @Param('id') postId: string,
    @Body() inputDto: PostInputDtoForCreate,
  ): Promise<void> {
    await this.postService.updatePost(postId, inputDto);
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePost(@Param('id') postId: string) {
    await this.postService.deletePost(postId);
    return;
  }
}

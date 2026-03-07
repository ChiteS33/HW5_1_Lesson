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
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BearerGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { UserDocument } from '../../user-accounts/domain/entities/users.entity';
import { InPutLikeStatusValidation } from '../validation/InPutLikeStatusValidation';
import { SetLikePostCommand } from '../application/use-cases/post-use-cases/setLike-post-use-case';
import { OptionalBearerGuard } from '../../user-accounts/guards/bearer/optional-bearer-guard.service';
import { ContentInputDto } from '../domain/entities/comments.entity';
import { CreateCommentCommand } from '../application/use-cases/comment-use-cases/create-comment-use-case';
import { BasicAuthGuard } from '../../user-accounts/guards/basic/basic-auth-guard.service';
import { PostInputDtoForCreate } from '../domain/entities/posts.entity';
import { CreatePostCommand } from '../application/use-cases/post-use-cases/create-post-use-case';
import { UpdatePostCommand } from '../application/use-cases/post-use-cases/update-post-use-case';
import { DeletePostCommand } from '../application/use-cases/post-use-cases/delete-post-use-case';
import { InputQueryPaginationTypeWithSearchName } from '../../../core/pagination/inputQueryPaginationTypeWithSearchName';
import { CommentsQueryRepository } from '../repositories/commentsRepositories/comments.queryRepository';
import { PostsQueryRepository } from '../repositories/postsRepositories/posts.queryRepository';
import { GetAllPostsQuery } from '../application/query-handlers/post-query-handlers/get-allPosts-query-handler';
import { PostViewType } from './view-types/posts/postView.type';
import { FinalViewWithPaginationType } from '../../../core/types/finalViewWithPagination.type';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
    @Inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @UseGuards(BearerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/like-status')
  async setLikeForPost(
    @Req() req: Request & { user: UserDocument },
    @Param('id') postId: string,
    @Body() likeStatus: InPutLikeStatusValidation,
  ): Promise<void> {
    await this.commandBus.execute(
      new SetLikePostCommand(postId, likeStatus.likeStatus, req.user),
    );
    return;
  }
  @UseGuards(OptionalBearerGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id/comments')
  async getAllCommentsByPostId(
    @Param('id') postId: string,
    @Query() pagination: InputQueryPaginationTypeWithSearchName,
    @Req() req: Request & { user: UserDocument },
  ) {
    const userId = req.user?._id?.toString();
    return this.commentsQueryRepository.findAllCommentsByPostId(
      postId,
      pagination,
      userId,
    );
  }

  @UseGuards(BearerGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(':id/comments')
  async createComment(
    @Req() req: Request & { user: UserDocument },
    @Param('id') postId: string,
    @Body() contentDto: ContentInputDto,
  ) {
    const inputDto = {
      postId,
      content: contentDto.content,
      userId: req.user.id,
      userLogin: req.user.login,
    };
    const createdCommentId: string = await this.commandBus.execute(
      new CreateCommentCommand(inputDto),
    );
    return this.commentsQueryRepository.findCommentById(createdCommentId);
  }
  @UseGuards(OptionalBearerGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllPosts(
    @Query() query: InputQueryPaginationTypeWithSearchName,
    @Req() req: Request & { user: UserDocument },
  ): Promise<FinalViewWithPaginationType<PostViewType>> {
    const userId = req.user?._id?.toString();
    return this.queryBus.execute(new GetAllPostsQuery(query, userId));
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createPost(@Body() postInputDto: PostInputDtoForCreate) {
    const createdPostId: string = await this.commandBus.execute(
      new CreatePostCommand(postInputDto),
    );
    return this.postsQueryRepository.findPostByPostId(createdPostId);
  }

  @UseGuards(OptionalBearerGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findPostById(
    @Param('id') postId: string,
    @Req() req: Request & { user: UserDocument },
  ) {
    const userId = req.user?._id?.toString();
    return this.postsQueryRepository.findPostByPostId(postId, userId);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updatePostById(
    @Param('id') postId: string,
    @Body() inputDto: PostInputDtoForCreate,
  ): Promise<void> {
    await this.commandBus.execute(new UpdatePostCommand(postId, inputDto));
    return;
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePost(@Param('id') postId: string): Promise<void> {
    await this.commandBus.execute(new DeletePostCommand(postId));
    return;
  }
}

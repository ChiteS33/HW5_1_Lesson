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
import { PostsQueryRepository } from './repositories/posts.queryRepository';
import { PostInputDtoForCreate } from './posts.entity';
import { CommentsQueryRepository } from '../comments/repositories/comments.queryRepository';
import { CreateCommentCommand } from '../comments/comment-use-cases/create-comment-use-case';
import { CreatePostCommand } from './post-use-cases/create-post-use-case';
import { Request } from 'express';
import { UserDocument } from '../users/users.entity';
import { ContentInputDto } from '../comments/comments.entity';
import { SetLikePostCommand } from './post-use-cases/setLike-post-use-case';
import { UpdatePostCommand } from './post-use-cases/update-post-use-case';
import { DeletePostCommand } from './post-use-cases/delete-post-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { InputPaginationType } from '../core/dto/base.query-params.input-dto';
import { BearerGuard } from '../core/guards/jwt-auth.guard';
import { BasicAuthGuard } from '../core/guards/basic-auth-guard.service';
import { OptionalBearerGuard } from '../core/guards/optional-bearer-guard.service';
import { InPutLikeStatusValidation } from '../comments/validation/comments.validation';
import { FinalWithPaginationType } from '../blogs/types/blog.types';
import { PostOutPutType } from './types/posts.types';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
    @Inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @UseGuards(BearerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/like-status')
  async setLike(
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
    @Query() pagination: InputPaginationType,
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
    @Query() query: InputPaginationType,
    @Req() req: Request & { user: UserDocument },
  ): Promise<FinalWithPaginationType<PostOutPutType>> {
    const userId = req.user?._id?.toString();
    return this.postsQueryRepository.findAllPosts(query, userId);
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

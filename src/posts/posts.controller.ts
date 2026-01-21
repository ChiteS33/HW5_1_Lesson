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
import { ContentInputDto, MyStatus } from '../comments/comments.entity';
import { SetLikePostCommand } from './post-use-cases/setLike-post-use-case';
import { UpdatePostCommand } from './post-use-cases/update-post-use-case';
import { DeletePostCommand } from './post-use-cases/delete-post-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { InputPaginationType } from '../core/dto/base.query-params.input-dto';
import { BearerGuard } from '../core/guards/jwt-auth.guard';
import { BasicAuthGuard } from '../core/guards/basic-auth-guard.service';

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
    @Body() likeStatus: MyStatus,
  ) {
    const inputDto = { postId, myStatus: likeStatus, user: req.user };
    await this.commandBus.execute(new SetLikePostCommand(inputDto));
    return;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/comments')
  async getAllCommentsByPostId(
    @Param('id') postId: string,
    @Query() pagination: InputPaginationType,
  ) {
    return this.commentsQueryRepository.getAllCommentsByPostId(
      postId,
      pagination,
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const createdCommentId = await this.commandBus.execute(
      new CreateCommentCommand(inputDto),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.commentsQueryRepository.getCommentById(createdCommentId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllPosts(@Query() query: InputPaginationType) {
    return this.postsQueryRepository.findAllPosts(query);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createPost(@Body() postInputDto: PostInputDtoForCreate) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const createdPostId = await this.commandBus.execute(
      new CreatePostCommand(postInputDto),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.postsQueryRepository.findPostByPostId(createdPostId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getPostById(@Param('id') postId: string) {
    return this.postsQueryRepository.findPostByPostId(postId);
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

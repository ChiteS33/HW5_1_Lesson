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
import { BlogInputDto } from './blogs.entity';
import { BlogsQueryRepository } from './repositories/blogs.queryRepository';
import { PostInputDto } from '../posts/posts.entity';
import { PostsQueryRepository } from '../posts/repositories/posts.queryRepository';
import { CreateBlogCommand } from './blog-use-cases/create-blog-use-case';
import { UpdateBlogCommand } from './blog-use-cases/update-blog-use-case';
import { DeleteBlogCommand } from './blog-use-cases/delete-blog-use-case';
import { CreatePostCommand } from '../posts/post-use-cases/create-post-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { InputPaginationType } from '../core/dto/base.query-params.input-dto';
import { InputPaginationWithSearchName } from './validation/blog.validation';
import { BlogOutPutType, FinalWithPaginationType } from './types/blog.types';
import { PostOutPutType } from '../posts/types/posts.types';
import { BasicAuthGuard } from '../core/guards/basic-auth-guard.service';
import { OptionalBearerGuard } from '../core/guards/optional-bearer-guard.service';
import { Request } from 'express';
import { UserDocument } from '../users/users.entity';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    @Inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllBlogs(
    @Query() query: InputPaginationWithSearchName,
  ): Promise<FinalWithPaginationType<BlogOutPutType>> {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBlog(
    @Body() blogInputDto: BlogInputDto,
  ): Promise<BlogOutPutType> {
    const createdBlogId: string = await this.commandBus.execute(
      new CreateBlogCommand(blogInputDto),
    );
    return await this.blogsQueryRepository.getBlogById(createdBlogId);
  }
  @UseGuards(OptionalBearerGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id/posts')
  async getAllPostsByBlogId(
    @Param('id') blogId: string,
    @Query() query: InputPaginationType,
    @Req() req: Request & { user: UserDocument },
  ): Promise<FinalWithPaginationType<PostOutPutType>> {
    const userId = req.user?._id?.toString();
    return this.postsQueryRepository.findAllPostsByBlogId(
      blogId,
      query,
      userId,
    );
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(':id/posts')
  async createPostByBlogId(
    @Param('id') blogId: string,
    @Body() postInputDto: PostInputDto,
  ): Promise<PostOutPutType> {
    const infoForCreatePost = { ...postInputDto, blogId };
    const createdPostId: string = await this.commandBus.execute(
      new CreatePostCommand(infoForCreatePost),
    );
    return this.postsQueryRepository.findPostByPostId(createdPostId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getBlogById(@Param('id') blogId: string): Promise<BlogOutPutType> {
    return this.blogsQueryRepository.getBlogById(blogId);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateBlogById(
    @Param('id') blogId: string,
    @Body() blogInputDto: BlogInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new UpdateBlogCommand(blogId, blogInputDto));
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string): Promise<void> {
    await this.commandBus.execute(new DeleteBlogCommand(blogId));
  }
}

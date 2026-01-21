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
import { BlogInputDto } from './blogs.entity';
import { BlogsQueryRepository } from './repositories/blogs.queryRepository';
import { PostService } from '../posts/posts.service';
import { PostInputDto } from '../posts/posts.entity';
import { PostsQueryRepository } from '../posts/repositories/posts.queryRepository';
import {
  BlogOutPutType,
  FinalWithPaginationType,
  InputPaginationWithSearchName,
} from './blogs.trash';
import { PostOutPutType } from '../posts/posts.trash';
import { CreateBlogCommand } from './blog-use-cases/create-blog-use-case';
import { UpdateBlogCommand } from './blog-use-cases/update-blog-use-case';
import { DeleteBlogCommand } from './blog-use-cases/delete-blog-use-case';
import {
  CreatePostCommand,
  CreatePostUseCase,
} from '../posts/post-use-cases/create-post-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { InputPaginationType } from '../core/dto/base.query-params.input-dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    @Inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
    @Inject(PostService) private postsService: PostService,
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
    @Inject(CreatePostUseCase) private createPostUseCase: CreatePostUseCase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllBlogs(
    @Query() query: InputPaginationWithSearchName,
  ): Promise<FinalWithPaginationType<BlogOutPutType>> {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBlog(
    @Body() blogInputDto: BlogInputDto,
  ): Promise<BlogOutPutType> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const createdBlogId = await this.commandBus.execute(
      new CreateBlogCommand(blogInputDto),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await this.blogsQueryRepository.getBlogById(createdBlogId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/posts')
  async getAllPostsByBlogId(
    @Param('id') blogId: string,
    @Query() query: InputPaginationType,
  ): Promise<FinalWithPaginationType<PostOutPutType>> {
    return this.postsQueryRepository.findAllPostsByBlogId(blogId, query);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(':id/posts')
  async createPostByBlogId(
    @Param('id') blogId: string,
    @Body() postInputDto: PostInputDto,
  ) {
    const infoForCreatePost = { ...postInputDto, blogId };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const createdPostId = await this.commandBus.execute(
      new CreatePostCommand(infoForCreatePost),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.postsQueryRepository.findPostByPostId(createdPostId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getBlogById(@Param('id') blogId: string) {
    return this.blogsQueryRepository.getBlogById(blogId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateBlogById(
    @Param('id') blogId: string,
    @Body() blogInputDto: BlogInputDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.commandBus.execute(new UpdateBlogCommand(blogId, blogInputDto));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.commandBus.execute(new DeleteBlogCommand(blogId));
  }
}

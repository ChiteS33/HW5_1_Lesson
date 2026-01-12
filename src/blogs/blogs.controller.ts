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
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogs.queryRepository';
import { PostService } from '../posts/posts.service';
import { PostInputDto } from '../posts/posts.entity';
import { PostsQueryRepository } from '../posts/posts.queryRepository';
import {
  BlogOutPutType,
  FinalWithPaginationType,
  InputPaginationType,
  InputPaginationWithSearchName,
} from './blogs.trash';
import { PostOutPutType } from '../posts/posts.trash';

@Controller('blogs')
export class BlogsController {
  constructor(
    @Inject(BlogsService) private blogsService: BlogsService,
    @Inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
    @Inject(PostService) private postsService: PostService,
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllBlogs(
    @Query() query: InputPaginationWithSearchName,
  ): Promise<FinalWithPaginationType<BlogOutPutType>> {
    return this.blogsQueryRepository.getAllBlogs(query);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBlog(
    @Body() blogInputDto: BlogInputDto,
  ): Promise<BlogOutPutType> {
    const createdBlogId = await this.blogsService.createBlog(blogInputDto);
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
    const createdPostId = await this.postsService.createPostByBlogId(
      blogId,
      postInputDto,
    );
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
    return this.blogsService.updateBlog(blogId, blogInputDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string) {
    return this.blogsService.deleteBlog(blogId);
  }
}

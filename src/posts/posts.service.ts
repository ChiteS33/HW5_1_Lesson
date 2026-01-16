import { Inject, Injectable } from '@nestjs/common';
import {
  PostDocument,
  PostInputDto,
  PostInputDtoForCreate,
  PostModel,
  PostModelI,
} from './posts.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostsRepository } from './posts.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { DomainException } from '../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel.name) private readonly postModel: PostModelI,
    @Inject(PostsRepository) private readonly postsRepository: PostsRepository,
    @Inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}

  async createPost(inputDto: PostInputDtoForCreate): Promise<string> {
    const foundBlog = await this.blogsRepository.findBlogByBlogId(
      inputDto.blogId,
    );
    if (!foundBlog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'blogId',
        message: 'Blog not found.',
      });
    }
    const newPost = PostModel.createPost(inputDto, foundBlog.name);
    return this.postsRepository.save(newPost);
  }

  async findPostById(postId: string): Promise<PostDocument> {
    const foundedPost = await this.postsRepository.findPostsById(postId);
    if (!foundedPost) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'postId',
        message: 'Post not found.',
      });
    }
    return foundedPost;
  }

  async createPostByBlogId(
    blogId: string,
    postInputDto: PostInputDto,
  ): Promise<string> {
    const foundBlog = await this.blogsRepository.findBlogByBlogId(blogId);
    if (!foundBlog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'blogId',
        message: 'Blog not found.',
      });
    }
    const createdPost = PostModel.createPost(
      { ...postInputDto, blogId },
      foundBlog.name,
    );
    return this.postsRepository.save(createdPost);
  }

  async updatePost(
    postId: string,
    postInputDto: PostInputDtoForCreate,
  ): Promise<void> {
    const foundedPost = await this.findPostById(postId);
    foundedPost.updatePost(postInputDto);
    await this.postsRepository.save(foundedPost);
    return;
  }

  async deletePost(postId: string): Promise<void> {
    await this.findPostById(postId);
    await this.postsRepository.deletePostById(postId);
    return;
  }
}

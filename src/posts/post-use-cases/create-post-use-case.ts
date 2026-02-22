import { Inject } from '@nestjs/common';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { PostInputDtoForCreate, PostModel } from '../posts.entity';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostsRepository } from '../repositories/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreatePostCommand {
  constructor(public inputDto: PostInputDtoForCreate) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    @Inject(BlogsRepository) private blogsRepository: BlogsRepository,
    @Inject(PostsRepository) private postsRepository: PostsRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<string> {
    const foundBlog = await this.blogsRepository.findBlogByBlogId(
      command.inputDto.blogId,
    );
    if (!foundBlog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'blogId',
        message: 'Blog not found.',
      });
    }
    const newPost = PostModel.createPost(command.inputDto, foundBlog.name);
    return this.postsRepository.save(newPost);
  }
}

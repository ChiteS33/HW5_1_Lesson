import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostInputDto } from '../../../domain/entities/posts.entity';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { Inject } from '@nestjs/common';
import { BlogsRepository } from '../../../repositories/blogsRepositories/blogs.repository';
import { PostsRepository } from '../../../repositories/postsRepositories/posts.repository';
import { PostsQueryRepository } from '../../../repositories/postsRepositories/posts.queryRepository';
import { PostViewWithLikesType } from '../../../api/view-types/posts/postViewWithLikes.type';

export class CreatePostByBlogIdSaCommand {
  constructor(
    public blogId: string,
    public postInputDto: PostInputDto,
  ) {}
}

@CommandHandler(CreatePostByBlogIdSaCommand)
export class CreatePostByBlogIdSaUseCase implements ICommandHandler<CreatePostByBlogIdSaCommand> {
  constructor(
    @Inject(BlogsRepository) private blogsRepository: BlogsRepository,
    @Inject(PostsRepository) private postsRepository: PostsRepository,
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute(
    command: CreatePostByBlogIdSaCommand,
  ): Promise<PostViewWithLikesType> {
    const foundBlog = await this.blogsRepository.findBlogByBlogId(
      command.blogId,
    );
    if (!foundBlog) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'blogId',
        message: 'Blog not found.',
      });
    }
    const createdPostId: string = await this.postsRepository.createPost(
      command.blogId,
      foundBlog.name,
      command.postInputDto,
    );
    return await this.postsQueryRepository.findPostByPostId(createdPostId);
  }
}

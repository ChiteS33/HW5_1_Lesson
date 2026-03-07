import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostService } from '../../posts.service';
import { PostInputDto } from '../../../domain/entities/posts.entity';
import { PostsRepository } from '../../../repositories/postsRepositories/posts.repository';
import { BlogsService } from '../../blogs.service';

export class UpdatePostByBlogIdSaCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public postInputDto: PostInputDto,
  ) {}
}

@CommandHandler(UpdatePostByBlogIdSaCommand)
export class UpdatePostByBlogIdSaUseCase implements ICommandHandler<UpdatePostByBlogIdSaCommand> {
  constructor(
    @Inject(PostsRepository) private postsRepository: PostsRepository,
    @Inject(PostService) private postService: PostService,
    @Inject(BlogsService) private blogsService: BlogsService,
  ) {}

  async execute(command: UpdatePostByBlogIdSaCommand): Promise<void> {
    await this.blogsService.findBlogById(command.blogId);
    await this.postService.findPostById(command.postId);
    await this.postsRepository.updatePost(
      command.blogId,
      command.postId,
      command.postInputDto,
    );
    return;
  }
}

import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostService } from '../../posts.service';
import { PostsRepository } from '../../../repositories/postsRepositories/posts.repository';
import { BlogsRepository } from '../../../repositories/blogsRepositories/blogs.repository';
import { BlogsService } from '../../blogs.service';

export class DeletePostByBlogIdSaCommand {
  constructor(
    public postId: string,
    public blogId: string,
  ) {}
}

@CommandHandler(DeletePostByBlogIdSaCommand)
export class DeletePostByBlogIdSaUseCase implements ICommandHandler<DeletePostByBlogIdSaCommand> {
  constructor(
    @Inject(PostsRepository) private postsRepository: PostsRepository,
    @Inject(BlogsService) private blogsService: BlogsService,
    @Inject(BlogsRepository) private blogsRepository: BlogsRepository,
    @Inject(PostService) private postService: PostService,
  ) {}

  async execute(command: DeletePostByBlogIdSaCommand): Promise<void> {
    await this.blogsService.findBlogById(command.blogId);
    await this.postService.findPostById(command.postId);
    await this.postsRepository.deletePostById(command.postId);
    return;
  }
}

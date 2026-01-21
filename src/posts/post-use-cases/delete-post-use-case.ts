import { Inject } from '@nestjs/common';
import { PostsRepository } from '../repositories/posts.repository';
import { PostService } from '../posts.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeletePostCommand {
  constructor(public postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    @Inject(PostsRepository) private postsRepository: PostsRepository,
    @Inject(PostService) private postService: PostService,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    await this.postService.findPostById(command.postId);
    await this.postsRepository.deletePostById(command.postId);
    return;
  }
}

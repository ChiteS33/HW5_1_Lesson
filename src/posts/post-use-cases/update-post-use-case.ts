import { Inject } from '@nestjs/common';
import { PostService } from '../posts.service';
import { PostInputDtoForCreate } from '../posts.entity';
import { PostsRepository } from '../repositories/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdatePostCommand {
  constructor(
    public postId: string,
    public postInputDto: PostInputDtoForCreate,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    @Inject(PostsRepository) private postsRepository: PostsRepository,
    @Inject(PostService) private postService: PostService,
  ) {}

  async execute(command: UpdatePostCommand): Promise<void> {
    const foundedPost = await this.postService.findPostById(command.postId);
    foundedPost.updatePost(command.postInputDto);
    await this.postsRepository.save(foundedPost);
    return;
  }
}

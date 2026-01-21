import { Inject } from '@nestjs/common';
import { PostService } from '../posts.service';
import { LikesForPostRepository } from '../../likes/likesForPosts/post.likes.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  LikeForPostModel,
  LikeForPostModelI,
} from '../../likes/likesForPosts/post.likes.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class SetLikePostCommand {
  constructor(public dto: any) {}
}

@CommandHandler(SetLikePostCommand)
export class SetLikePostUseCase implements ICommandHandler<SetLikePostCommand> {
  constructor(
    @Inject(PostService) private postService: PostService,
    @Inject(LikesForPostRepository)
    private likesForPostRepository: LikesForPostRepository,
    @InjectModel(LikeForPostModel.name)
    private likeForPostModel: LikeForPostModelI,
  ) {}
  async execute(command: SetLikePostCommand): Promise<string> {
    await this.postService.findPostById(command.dto.postId);
    const foundPostLike =
      await this.likesForPostRepository.findLikeByUserIdAndPostId(
        command.dto.user._id.toString(),
        command.dto.postId,
      );
    if (!foundPostLike) {
      const newLike = this.likeForPostModel.createLikeForPost(command.dto);
      return this.likesForPostRepository.save(newLike);
    }
    foundPostLike.updatePostLikeStatus(command.dto.likeStatus.likeStatus);
    return this.likesForPostRepository.save(foundPostLike);
  }
}

import { Inject } from '@nestjs/common';
import { PostService } from '../posts.service';
import { LikesForPostRepository } from '../../likes/likesForPosts/post.likes.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  LikeForPostModel,
  LikeForPostModelI,
} from '../../likes/likesForPosts/post.likes.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeDislikeStatus } from '../posts.entity';
import { UserDocument } from '../../users/users.entity';

export class SetLikePostCommand {
  constructor(
    public postId: string,
    public likeStatus: LikeDislikeStatus,
    public user: UserDocument,
  ) {}
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
    await this.postService.findPostById(command.postId);

    const foundPostLike =
      await this.likesForPostRepository.findLikeByUserIdAndPostId(
        command.user._id.toString(),
        command.postId,
      );

    if (!foundPostLike) {
      const newLike = this.likeForPostModel.createLikeForPost(command);
      return this.likesForPostRepository.save(newLike);
    }

    foundPostLike.updatePostLikeStatus(command.likeStatus);
    return this.likesForPostRepository.save(foundPostLike);
  }
}

import { Inject } from '@nestjs/common';
import { CommentsService } from '../comments.service';
import {
  LikeForCommentsModel,
  LikeForCommentsModelI,
} from '../../likes/likesForComments/comment.likes.entity';
import { LikesForCommentRepository } from '../../likes/likesForComments/comment.likes.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../users/users.entity';
import { LikeDislikeStatus } from '../../posts/posts.entity';

export class SetLikeCommentsCommand {
  constructor(
    public commentId: string,
    public likeStatus: LikeDislikeStatus,
    public user: UserDocument,
  ) {}
}

@CommandHandler(SetLikeCommentsCommand)
export class SetLikeCommentsUseCase implements ICommandHandler<SetLikeCommentsCommand> {
  constructor(
    @Inject(CommentsService) private commentsService: CommentsService,
    @Inject(LikesForCommentRepository)
    private likesForCommentRepository: LikesForCommentRepository,
    @InjectModel(LikeForCommentsModel.name)
    private likeForCommentsModel: LikeForCommentsModelI,
  ) {}
  async execute(command: SetLikeCommentsCommand): Promise<void> {
    console.log(command);
    await this.commentsService.findCommentById(command.commentId);
    const foundCommentLike =
      await this.likesForCommentRepository.findLikeByUserIdAndCommentId(
        command.user._id.toString(),
        command.commentId,
      );
    if (!foundCommentLike) {
      const newLike = this.likeForCommentsModel.createLikeForComment(command);
      await this.likesForCommentRepository.save(newLike);
      return;
    }
    foundCommentLike.updateCommentLikeStatus(command.likeStatus);

    await this.likesForCommentRepository.save(foundCommentLike);
    return;
  }
}

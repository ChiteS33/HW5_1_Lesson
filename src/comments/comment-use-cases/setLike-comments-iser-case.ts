import { Inject } from '@nestjs/common';
import { CommentsService } from '../comments.service';
import {
  LikeForCommentsModel,
  LikeForCommentsModelI,
} from '../../likes/likesForComments/comment.likes.entity';
import { LikesForCommentRepository } from '../../likes/likesForComments/comment.likes.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class SetLikeCommentsCommand {
  constructor(public dto: any) {}
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
  async execute(command: SetLikeCommentsCommand): Promise<string> {
    await this.commentsService.findCommentById(command.dto.commentId);
    const foundCommentLike =
      await this.likesForCommentRepository.findLikeByUserIdAndCommentId(
        command.dto.user._id.toString(),
        command.dto.commentId,
      );
    if (!foundCommentLike) {
      const newLike = this.likeForCommentsModel.createLikeForComment(
        command.dto,
      );
      return this.likesForCommentRepository.save(newLike);
    }
    foundCommentLike.updateCommentLikeStatus(command.dto.likeStatus.likeStatus);

    return this.likesForCommentRepository.save(foundCommentLike);
  }
}

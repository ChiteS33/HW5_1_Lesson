import { Inject } from '@nestjs/common';
import { CommentsService } from '../comments.service';
import { CommentsRepository } from '../repositories/comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteCommentCommand {
  constructor(public commentId: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
  constructor(
    @Inject(CommentsService) private commentsService: CommentsService,
    @Inject(CommentsRepository) private commentsRepository: CommentsRepository,
  ) {}
  async execute(command: DeleteCommentCommand): Promise<void> {
    await this.commentsService.findCommentById(command.commentId);
    await this.commentsRepository.deleteComment(command.commentId);
  }
}

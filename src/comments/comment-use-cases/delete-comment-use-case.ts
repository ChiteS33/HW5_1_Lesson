import { Inject } from '@nestjs/common';
import { CommentsService } from '../comments.service';
import { CommentsRepository } from '../repositories/comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';

export class DeleteCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
  constructor(
    @Inject(CommentsService) private commentsService: CommentsService,
    @Inject(CommentsRepository) private commentsRepository: CommentsRepository,
  ) {}
  async execute(command: DeleteCommentCommand): Promise<void> {
    const foundComment = await this.commentsService.findCommentById(
      command.commentId,
    );
    if (foundComment.commentatorInfo.userId !== command.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        field: 'jwtToken',
        message: 'You dont have permission to delete a comment',
      });
    }
    await this.commentsRepository.deleteComment(command.commentId);
  }
}

import { Inject } from '@nestjs/common';
import { CommentsService } from '../comments.service';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import { CommentsRepository } from '../repositories/comments.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InputDtoForUpdateComment } from '../../posts/types/posts.types';

export class UpdateCommentCommand {
  constructor(public inputDto: InputDtoForUpdateComment) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
  constructor(
    @Inject(CommentsService) private commentsService: CommentsService,
    @Inject(CommentsRepository) private commentsRepository: CommentsRepository,
  ) {}
  async execute(command: UpdateCommentCommand): Promise<void> {
    const foundComment = await this.commentsService.findCommentById(
      command.inputDto.commentId,
    );
    if (foundComment.commentatorInfo.userId !== command.inputDto.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        field: 'jwtToken',
        message: 'You dont have permission to update a comment',
      });
    }

    foundComment.updateComment(command.inputDto.content);
    await this.commentsRepository.save(foundComment);
    return;
  }
}

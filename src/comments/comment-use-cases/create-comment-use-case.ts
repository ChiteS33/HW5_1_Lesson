import { Inject } from '@nestjs/common';
import { PostService } from '../../posts/posts.service';
import { CommentsRepository } from '../repositories/comments.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModel, CommentModelI } from '../comments.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InputDtoForCreateComment } from '../../posts/types/posts.types';

export class CreateCommentCommand {
  constructor(public inputDto: InputDtoForCreateComment) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
  constructor(
    @Inject(PostService) private postService: PostService,
    @Inject(CommentsRepository) private commentsRepository: CommentsRepository,
    @InjectModel(CommentModel.name) private commentModel: CommentModelI,
  ) {}
  async execute(command: CreateCommentCommand): Promise<string> {
    await this.postService.findPostById(command.inputDto.postId);
    const newComment = this.commentModel.createComment(command.inputDto);
    return this.commentsRepository.save(newComment);
  }
}

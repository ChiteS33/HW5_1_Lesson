import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CommentsQueryRepository } from './comments.queryRepository';

@Controller('comments')
export class CommentsController {
  constructor(
    @Inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getCommentById(@Param('id') commentId: string) {
    const foundedComment =
      await this.commentsQueryRepository.getCommentById(commentId);
    if (!foundedComment) throw new NotFoundException();
    return foundedComment;
  }
}

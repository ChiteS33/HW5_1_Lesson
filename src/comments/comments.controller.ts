import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from './repositories/comments.queryRepository';
import { DeleteCommentCommand } from './comment-use-cases/delete-comment-use-case';
import { ContentInputDto } from './comments.entity';
import { UpdateCommentCommand } from './comment-use-cases/update-comment-use-case';
import { Request } from 'express';
import { UserDocument } from '../users/users.entity';
import { SetLikeCommentsCommand } from './comment-use-cases/setLike-comments-iser-case';
import { CommandBus } from '@nestjs/cqrs';
import { BearerGuard } from '../core/guards/jwt-auth.guard';
import { OptionalBearerGuard } from '../core/guards/optional-bearer-guard.service';
import { InPutLikeStatusValidation } from './validation/comments.validation';

@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    @Inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @UseGuards(BearerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/like-status')
  async setLike(
    @Req() req: Request & { user: UserDocument },
    @Param('id') commentId: string,
    @Body() likeStatus: InPutLikeStatusValidation,
  ) {
    const inputDto = { commentId, likeStatus: likeStatus, user: req.user };
    await this.commandBus.execute(new SetLikeCommentsCommand(inputDto));
    return;
  }

  @UseGuards(BearerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateComment(
    @Req() req: Request & { user: UserDocument },
    @Param('id') commentId: string,
    @Body() content: ContentInputDto,
  ) {
    const inputDto = {
      commentId,
      content: content.content,
      userId: req.user.id,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.commandBus.execute(new UpdateCommentCommand(inputDto));
  }

  @UseGuards(BearerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteComment(
    @Param('id') commentId: string,
    @Req() req: Request & { user: UserDocument },
  ): Promise<void> {
    const userId = req.user?._id?.toString();
    return this.commandBus.execute(new DeleteCommentCommand(commentId, userId));
  }
  @UseGuards(OptionalBearerGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findCommentById(
    @Param('id') commentId: string,
    @Req() req: Request & { user: UserDocument },
  ) {
    const userId = req.user?._id?.toString();
    return this.commentsQueryRepository.findCommentById(commentId, userId);
  }
}

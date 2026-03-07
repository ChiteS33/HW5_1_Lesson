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
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { BearerGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { UserDocument } from '../../user-accounts/domain/entities/users.entity';
import { InPutLikeStatusValidation } from '../validation/InPutLikeStatusValidation';
import { SetLikeCommentsCommand } from '../application/use-cases/comment-use-cases/setLike-comments-iser-case';
import { ContentInputDto } from '../domain/entities/comments.entity';
import { UpdateCommentCommand } from '../application/use-cases/comment-use-cases/update-comment-use-case';
import { DeleteCommentCommand } from '../application/use-cases/comment-use-cases/delete-comment-use-case';
import { OptionalBearerGuard } from '../../user-accounts/guards/bearer/optional-bearer-guard.service';
import { CommentsQueryRepository } from '../repositories/commentsRepositories/comments.queryRepository';
import { CommentViewType } from './view-types/comments/commentView.type';

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
  ): Promise<void> {
    await this.commandBus.execute(
      new SetLikeCommentsCommand(commentId, likeStatus.likeStatus, req.user),
    );
  }

  @UseGuards(BearerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updateComment(
    @Req() req: Request & { user: UserDocument },
    @Param('id') commentId: string,
    @Body() content: ContentInputDto,
  ): Promise<void> {
    const inputDto = {
      commentId,
      content: content.content,
      userId: req.user.id,
    };
    await this.commandBus.execute(new UpdateCommentCommand(inputDto));
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
  ): Promise<CommentViewType | null> {
    const userId = req.user?._id?.toString();
    return this.commentsQueryRepository.findCommentById(commentId, userId);
  }
}

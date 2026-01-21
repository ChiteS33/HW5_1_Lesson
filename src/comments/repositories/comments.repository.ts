import { Injectable } from '@nestjs/common';
import {
  CommentDocument,
  CommentModel,
  CommentModelI,
} from '../comments.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly commentModel: CommentModelI,
  ) {}

  async save(comment: CommentDocument | CommentModel): Promise<string> {
    const dataAboutSavedComment = await this.commentModel.create(comment);
    await dataAboutSavedComment.save();
    return dataAboutSavedComment._id.toString();
  }

  async findCommentById(commentId: string): Promise<CommentDocument | null> {
    return this.commentModel.findOne({ _id: commentId });
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.commentModel.deleteOne({ _id: commentId });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  LikeForCommentDocument,
  LikeForCommentsModel,
  LikeForCommentsModelI,
} from './comment.likes.entity';

@Injectable()
export class LikesForCommentRepository {
  constructor(
    @InjectModel(LikeForCommentsModel.name)
    private likeModel: LikeForCommentsModelI,
  ) {}
  async save(
    like: LikeForCommentDocument | LikeForCommentsModel,
  ): Promise<string> {
    const dataAboutLike = await this.likeModel.create(like);
    await dataAboutLike.save();
    return dataAboutLike._id.toString();
  }

  async findLikeByUserIdAndCommentId(
    userId: string,
    commentId: string,
  ): Promise<LikeForCommentDocument | null> {
    return this.likeModel.findOne({ commentId, userId });
  }
}

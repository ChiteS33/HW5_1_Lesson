import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import {
  LikeForPostDocument,
  LikeForPostModel,
  LikeForPostModelI,
} from './post.likes.entity';

@Injectable()
export class LikesForPostRepository {
  constructor(
    @InjectModel(LikeForPostModel.name) private likeModel: LikeForPostModelI,
  ) {}
  async save(like: LikeForPostDocument | LikeForPostModel): Promise<string> {
    const dataAboutLike = await this.likeModel.create(like);
    await dataAboutLike.save();
    return dataAboutLike._id.toString();
  }

  async findLikeByUserIdAndPostId(
    userId: string,
    postId: string,
  ): Promise<LikeForPostDocument | null> {
    return this.likeModel.findOne({ userId, postId });
  }
}

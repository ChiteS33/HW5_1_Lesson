import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeDislikeStatus } from '../../posts/posts.entity';
import { HydratedDocument, Model } from 'mongoose';
import { UserDocument } from '../../users/users.entity';

@Schema({ versionKey: false })
export class LikeForPostModel {
  constructor() {}
  @Prop({ type: String, required: true }) userId: string;
  @Prop({ type: String, required: true }) login: string;
  @Prop({ type: String, required: true }) postId: string;
  @Prop({ type: String, enum: LikeDislikeStatus, required: true })
  status: LikeDislikeStatus;
  @Prop({ type: Date, required: true }) data: Date;

  public static createLikeForPost(
    postId: string,
    likeStatus: LikeDislikeStatus,
    user: UserDocument,
  ): LikeForPostModel {
    const newLike = new LikeForPostModel();
    newLike.userId = user._id.toString();
    newLike.login = user.login;
    newLike.postId = postId;
    newLike.status = likeStatus;

    newLike.data = new Date();

    return newLike;
  }

  updatePostLikeStatus(likeStatus: LikeDislikeStatus) {
    this.status = likeStatus;
    return;
  }
}
export type LikeForPostDocument = HydratedDocument<LikeForPostModel>;

export const LikeForPostSchema = SchemaFactory.createForClass(LikeForPostModel);
LikeForPostSchema.loadClass(LikeForPostModel);
export interface LikeForPostModelI extends Model<LikeForPostDocument> {
  createLikeForPost(dto: any): LikeForPostModel;
}

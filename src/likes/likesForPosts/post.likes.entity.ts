import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeDislikeStatus } from '../../posts/posts.entity';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ versionKey: false })
export class LikeForPostModel {
  constructor() {}
  @Prop({ type: String, required: true }) userId: string;
  @Prop({ type: String, required: true }) login: string;
  @Prop({ type: String, required: true }) postId: string;
  @Prop({ type: String, enum: LikeDislikeStatus, required: true })
  status: LikeDislikeStatus;
  @Prop({ type: Date, required: true }) data: Date;

  public static createLikeForPost(dto: any) {
    const newLike = new LikeForPostModel();
    newLike.userId = dto.user._id.toString();
    newLike.login = dto.user.login;
    newLike.postId = dto.postId;
    newLike.status = dto.likeStatus.likeStatus;

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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MyStatus } from '../../posts/posts.entity';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ versionKey: false })
export class LikeForCommentsModel {
  constructor() {}
  @Prop({ type: String, required: true }) userId: string;
  @Prop({ type: String, required: true }) login: string;
  @Prop({ type: String, required: true }) commentId: string;
  @Prop({ type: String, enum: MyStatus, required: true }) status: string;
  @Prop({ type: Date, required: true }) data: Date;

  public static createLikeForComment(dto: any) {
    const newLike = new LikeForCommentsModel();

    newLike.userId = dto.user._id.toString();
    newLike.login = dto.user.login;
    newLike.commentId = dto.commentId;
    newLike.status = dto.likeStatus.likeStatus;
    newLike.data = new Date();
    return newLike;
  }

  public updateCommentLikeStatus(likeStatus: string) {
    this.status = likeStatus;
  }
}

export type LikeForCommentDocument = HydratedDocument<LikeForCommentsModel>;

export const LikeForCommentSchema =
  SchemaFactory.createForClass(LikeForCommentsModel);
LikeForCommentSchema.loadClass(LikeForCommentsModel);
export interface LikeForCommentsModelI extends Model<LikeForCommentDocument> {
  createLikeForComment(dto: any): LikeForCommentDocument;
}

import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = HydratedDocument<CommentModel>;

export type CommentInputDto = {
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
  likesInfo: LikesInfo;
};

export enum MyStatus {
  none = 'None',
  like = 'Like',
  dislike = 'Dislike',
}

@Schema()
export class CommentatorInfo {
  @Prop({ type: String, required: true }) userId: string;
  @Prop({ type: String, required: true }) userLogin: string;
}

@Schema()
export class LikesInfo {
  @Prop({ type: String, default: 0 }) likesCount: number;
  @Prop({ type: String, default: 0 }) dislikesCount: number;
  @Prop({ enum: MyStatus }) myStatus: MyStatus;
}

@Schema({ versionKey: false })
export class CommentModel {
  constructor() {}
  @Prop({ type: String, required: true }) content: string;
  @Prop({ type: CommentatorInfo, required: true })
  commentatorInfo: CommentatorInfo;
  @Prop({ type: Date, required: true }) createdAt: Date;
  @Prop({ type: LikesInfo, required: true }) likesInfo: LikesInfo;
}

export const CommentSchema = SchemaFactory.createForClass(CommentModel);
CommentSchema.loadClass(CommentModel);
export interface CommentModelI extends Model<CommentDocument> {
  //
}

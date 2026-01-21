import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { InputDtoForCreateComment } from '../posts/posts.trash';
import { IsStringWithTrim } from '../core/decorators/validation/is-string-with-trim';

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
export class ContentInputDto {
  @IsStringWithTrim(20, 300)
  content: string;
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

  public static createComment(
    inputDto: InputDtoForCreateComment,
  ): CommentModel {
    const likeInfo = {
      likesCount: 1,
      dislikesCount: 3,
      myStatus: MyStatus.none,
    };
    const commentInfo = {
      userId: inputDto.userId,
      userLogin: inputDto.userLogin,
    };
    const newComment = new CommentModel();
    newComment.content = inputDto.content;
    newComment.commentatorInfo = commentInfo;
    newComment.createdAt = new Date();
    newComment.likesInfo = likeInfo;
    return newComment;
  }

  updateComment(inputDto: string) {
    this.content = inputDto;
    return;
  }
}

export const CommentSchema = SchemaFactory.createForClass(CommentModel);
CommentSchema.loadClass(CommentModel);
export interface CommentModelI extends Model<CommentDocument> {
  createComment(inputDto: InputDtoForCreateComment): CommentModel;
}

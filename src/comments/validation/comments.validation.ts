import { IsEnum } from 'class-validator';

export enum MyStatus {
  none = 'None',
  like = 'Like',
  dislike = 'Dislike',
}

export class InPutLikeStatusValidation {
  @IsEnum(MyStatus)
  likeStatus: MyStatus;
}

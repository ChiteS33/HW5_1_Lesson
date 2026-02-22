import { IsEnum } from 'class-validator';
import { LikeDislikeStatus } from '../../posts/posts.entity';

export class InPutLikeStatusValidation {
  @IsEnum(LikeDislikeStatus)
  likeStatus: LikeDislikeStatus;
}

import { IsEnum } from 'class-validator';
import { LikeDislikeStatus } from '../domain/entities/posts.entity';

export class InPutLikeStatusValidation {
  @IsEnum(LikeDislikeStatus)
  likeStatus: LikeDislikeStatus;
}

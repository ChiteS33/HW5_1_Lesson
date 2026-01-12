import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export type PostDocument = HydratedDocument<PostModel>;

export type PostInputDto = {
  title: string;
  shortDescription: string;
  content: string;
};

export type PostInputDtoForCreate = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export enum MyStatus {
  none = 'None',
  like = 'Like',
  dislike = 'Dislike',
}

@Schema()
export class NewestLikesInfo {
  @Prop({ type: Date, default: null }) addedAt: Date | null;
  @Prop({ type: String, default: null }) userId: string | null;
  @Prop({ type: String, default: null }) login: string | null;
}

@Schema()
export class ExtendedLikesInfo {
  @Prop({ type: Number, default: 0 }) likesCount: number;
  @Prop({ type: Number, default: 0 }) dislikesCount: number;
  @Prop({ type: [NewestLikesInfo], default: [] })
  newestLikes: NewestLikesInfo[];
}

@Schema({ versionKey: false })
export class PostModel {
  constructor() {}
  @Prop({ type: String, required: true }) title: string;
  @Prop({ type: String, required: true }) shortDescription: string;
  @Prop({ type: String, required: true }) content: string;
  @Prop({ type: String, required: true }) blogId: string;
  @Prop({ type: String, required: true }) blogName: string;
  @Prop({ type: Date, required: true }) createdAt: Date;
  @Prop({ _id: false, type: ExtendedLikesInfo, required: true })
  extendedLikesInfo: ExtendedLikesInfo;

  public static createPost(
    dto: PostInputDtoForCreate,
    blogName: string,
  ): PostModel {
    const extendedLikes = {
      likesCount: 0,
      dislikesCount: 0,
      newestLikes: [],
    };

    const newPost = new PostModel();
    newPost.title = dto.title;
    newPost.shortDescription = dto.shortDescription;
    newPost.content = dto.content;
    newPost.blogId = dto.blogId;
    newPost.blogName = blogName;
    newPost.createdAt = new Date();
    newPost.extendedLikesInfo = extendedLikes;
    console.log(newPost);
    return newPost;
  }

  updatePost(postInputDto: PostInputDtoForCreate) {
    this.title = postInputDto.title;
    this.shortDescription = postInputDto.shortDescription;
    this.content = postInputDto.content;
    this.blogId = postInputDto.blogId!;
  }
}

export const PostSchema = SchemaFactory.createForClass(PostModel);
PostSchema.loadClass(PostModel);
export interface PostModelI extends Model<PostDocument> {
  createPost(dto: PostInputDto, blogName: string): PostModel;
}

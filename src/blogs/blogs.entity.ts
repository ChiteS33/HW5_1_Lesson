import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export type BlogInputDto = {
  name: string;
  description: string;
  websiteUrl: string;
};

@Schema({ versionKey: false })
export class BlogModel {
  @Prop({ type: String, required: true }) name: string;
  @Prop({ type: String, required: true }) description: string;
  @Prop({ type: String, required: true }) websiteUrl: string;
  @Prop({ type: Date, required: true }) createdAt: Date;
  @Prop({ type: Boolean, required: true }) isMembership: boolean;

  public static createBlog(dto: BlogInputDto): BlogModel {
    const newBlog = new BlogModel();
    newBlog.name = dto.name;
    newBlog.description = dto.description;
    newBlog.websiteUrl = dto.websiteUrl;
    newBlog.createdAt = new Date();
    newBlog.isMembership = false;
    return newBlog;
  }

  updateBlog(blogInputDto: BlogInputDto) {
    this.name = blogInputDto.name;
    this.description = blogInputDto.description;
    this.websiteUrl = blogInputDto.websiteUrl;
    return;
  }
}

export const BlogSchema = SchemaFactory.createForClass(BlogModel);
BlogSchema.loadClass(BlogModel);
export type BlogDocument = HydratedDocument<BlogModel>;
export interface BlogModelI extends Model<BlogDocument> {
  createBlog(dto: BlogInputDto): BlogModel;
}

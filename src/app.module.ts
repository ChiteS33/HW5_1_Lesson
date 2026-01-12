import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './users/users.entity';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { DeleteAllController } from './test/test.controller';
import { UsersQueryRepository } from './users/users.queryRepository';
import { BlogModel, BlogSchema } from './blogs/blogs.entity';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import { BlogsQueryRepository } from './blogs/blogs.queryRepository';
import { PostModel, PostSchema } from './posts/posts.entity';
import { PostsController } from './posts/posts.controller';
import { PostsRepository } from './posts/posts.repository';
import { PostsQueryRepository } from './posts/posts.queryRepository';
import { PostService } from './posts/posts.service';
import { CommentModel, CommentSchema } from './comments/comments.entity';
import { CommentsController } from './comments/comments.controller';
import { CommentsQueryRepository } from './comments/comments.queryRepository';
import { CommentsService } from './comments/comments.service';
import { CommentsRepository } from './comments/comments.repository';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/Grecha'),
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
      {
        name: BlogModel.name,
        schema: BlogSchema,
      },
      {
        name: PostModel.name,
        schema: PostSchema,
      },
      {
        name: CommentModel.name,
        schema: CommentSchema,
      },
    ]),
  ],
  controllers: [
    UsersController,
    DeleteAllController,
    BlogsController,
    PostsController,
    CommentsController,
  ],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostService,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
  ],
})
export class AppModule {}

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
import { LocalStrategy } from './Auth/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './Auth/strategies/constants';
import { AuthService } from './Auth/auth.service';
import { AuthController } from './Auth/auth.controller';
import { JwtStrategy } from './Auth/strategies/jwt.strategy';
import { BasicStrategy } from './Auth/strategies/basic.strategy';
import { EmailAdapter } from './Auth/emailAdapter/email-adapter';
import { BcryptService } from './Auth/bcryptAdapter/bcrypt.service';

import { APP_FILTER } from '@nestjs/core';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
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
    AuthController,
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
    LocalStrategy,
    BasicStrategy,
    JwtStrategy,
    BcryptService,
    AuthService,
    EmailAdapter,
    {
      provide: APP_FILTER,
      useClass: AllHttpExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainHttpExceptionsFilter,
    },
  ],
})
export class AppModule {}

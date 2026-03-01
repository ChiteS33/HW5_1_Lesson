import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './users/users.entity';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/repositories/users.repository';
import { DeleteAllController } from './test/test.controller';
import { UsersQueryRepository } from './users/repositories/users.queryRepository';
import { BlogModel, BlogSchema } from './blogs/blogs.entity';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { BlogsQueryRepository } from './blogs/repositories/blogs.queryRepository';
import { PostModel, PostSchema } from './posts/posts.entity';
import { PostsController } from './posts/posts.controller';
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsQueryRepository } from './posts/repositories/posts.queryRepository';
import { PostService } from './posts/posts.service';
import { CommentModel, CommentSchema } from './comments/comments.entity';
import { CommentsController } from './comments/comments.controller';
import { CommentsQueryRepository } from './comments/repositories/comments.queryRepository';
import { CommentsService } from './comments/comments.service';
import { CommentsRepository } from './comments/repositories/comments.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './Auth/auth.service';
import { AuthController } from './Auth/auth.controller';
import { APP_FILTER } from '@nestjs/core';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';
import { CreateUserUseCase } from './users/user-use-cases/create-user-use-case';
import { DeleteUserUseCase } from './users/user-use-cases/delete-user-use-case';
import { LoginUseCase } from './Auth/auth-use-cases/login-use-case';
import { RecoveryPasswordUseCase } from './Auth/auth-use-cases/recovery-password-use-case';
import { ConfirmPasswordRecoveryUseCase } from './Auth/auth-use-cases/confirm-password-use-case';
import { ConfirmRegistrationUseCase } from './Auth/auth-use-cases/confirm-registration-use-case';
import { RegistrationInSystemUseCase } from './Auth/auth-use-cases/registration-in-system-use-case';
import { ResendEmailResendingEmailUseCase } from './Auth/auth-use-cases/resend-confirmation-email-use-case';
import { GetInfoAboutUserUseCase } from './Auth/auth-use-cases/get-info-about-user-use-case';
import { CreateBlogUseCase } from './blogs/blog-use-cases/create-blog-use-case';
import { UpdateBlogUseCase } from './blogs/blog-use-cases/update-blog-use-case';
import { DeleteBlogUseCase } from './blogs/blog-use-cases/delete-blog-use-case';
import { CreateCommentUseCase } from './comments/comment-use-cases/create-comment-use-case';
import { CreatePostUseCase } from './posts/post-use-cases/create-post-use-case';
import { DeleteCommentUseCase } from './comments/comment-use-cases/delete-comment-use-case';
import { UpdateCommentUseCase } from './comments/comment-use-cases/update-comment-use-case';
import {
  LikeForPostModel,
  LikeForPostSchema,
} from './likes/likesForPosts/post.likes.entity';
import { LikesForPostRepository } from './likes/likesForPosts/post.likes.repository';
import {
  LikeForCommentSchema,
  LikeForCommentsModel,
} from './likes/likesForComments/comment.likes.entity';
import { LikesForCommentRepository } from './likes/likesForComments/comment.likes.repository';
import { SetLikeCommentsUseCase } from './comments/comment-use-cases/setLike-comments-iser-case';
import { SetLikePostUseCase } from './posts/post-use-cases/setLike-post-use-case';
import { UpdatePostUseCase } from './posts/post-use-cases/update-post-use-case';
import { DeletePostUseCase } from './posts/post-use-cases/delete-post-use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtAdapter } from './core/adapters/jwtAdapter/jwt-adapter.service';
import { LocalStrategy } from './core/guards/strategies/local.strategy';
import { BasicStrategy } from './core/guards/strategies/basic.strategy';
import { JwtStrategy } from './core/guards/strategies/jwt.strategy';
import { BcryptService } from './core/adapters/bcryptAdapter/bcrypt.service';
import { EmailAdapter } from './core/adapters/emailAdapter/email-adapter';
import { settings } from './core/guards/strategies/constants';
import { SessionSchema, SessionsModel } from './sessions/sessions.entity';
import { SessionsRepository } from './sessions/repostiory/sessions.repository';
import { SessionsController } from './sessions/sessions.controller';
import { FindAllUsersUseCase } from './sessions/sessions-use-cases/find-sessions-use-case';
import { DeleteAllExcludeUserUseCase } from './sessions/sessions-use-cases/delete-all-exclude-user-use-case';
import { SessionsService } from './sessions/sessions.service';
import { DeleteSessionByDeviceIdUseCase } from './sessions/sessions-use-cases/delete-session-by-user-use-case';
import { LogoutUseCase } from './Auth/auth-use-cases/logout-use-case';
import { RefreshTokensUseCase } from './Auth/auth-use-cases/refresh-tokens-use-case';
import { JwtRefreshStrategy } from './core/guards/strategies/refreshToken.strategy';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

const services = [
  UsersService,
  BlogsService,
  PostService,
  CommentsService,
  AuthService,
  SessionsService,
];
const repositories = [
  UsersRepository,
  BlogsRepository,
  PostsRepository,
  CommentsRepository,
  LikesForPostRepository,
  LikesForCommentRepository,
  SessionsRepository,
];
const queryRepositories = [
  UsersQueryRepository,
  BlogsQueryRepository,
  PostsQueryRepository,
  CommentsQueryRepository,
];
const sessionUseCases = [
  FindAllUsersUseCase,
  DeleteAllExcludeUserUseCase,
  DeleteSessionByDeviceIdUseCase,
];
const userUseCases = [CreateUserUseCase, DeleteUserUseCase];
const authUseCases = [
  LoginUseCase,
  RecoveryPasswordUseCase,
  ConfirmPasswordRecoveryUseCase,
  ConfirmRegistrationUseCase,
  RegistrationInSystemUseCase,
  ResendEmailResendingEmailUseCase,
  GetInfoAboutUserUseCase,
  LogoutUseCase,
  RefreshTokensUseCase,
];
const blogUseCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase];
const commentsUseCases = [
  CreateCommentUseCase,
  DeleteCommentUseCase,
  UpdateCommentUseCase,
  SetLikeCommentsUseCase,
];
const postsUseCases = [
  CreatePostUseCase,
  SetLikePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
];
const adapters = [BcryptService, EmailAdapter, JwtAdapter];
const controllers = [
  UsersController,
  DeleteAllController,
  BlogsController,
  PostsController,
  CommentsController,
  AuthController,
  SessionsController,
];
const errorFilters = [
  {
    provide: APP_FILTER,
    useClass: AllHttpExceptionsFilter,
  },
  {
    provide: APP_FILTER,
    useClass: DomainHttpExceptionsFilter,
  },
];
const errorStrategies = [
  LocalStrategy,
  BasicStrategy,
  JwtStrategy,
  JwtRefreshStrategy,
];
const schemas = [
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
  {
    name: LikeForPostModel.name,
    schema: LikeForPostSchema,
  },
  {
    name: LikeForCommentsModel.name,
    schema: LikeForCommentSchema,
  },
  {
    name: SessionsModel.name,
    schema: SessionSchema,
  },
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      autoLoadEntities: false,
      synchronize: false,
    }),
    CqrsModule,
    PassportModule,
    JwtModule.register({
      secret: settings.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/Grecha'),
    MongooseModule.forFeature([...schemas]),

    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
  ],

  controllers: controllers,
  providers: [
    ...services,
    ...repositories,
    ...queryRepositories,
    ...errorStrategies,
    ...adapters,
    ...errorFilters,
    ...userUseCases,
    ...authUseCases,
    ...blogUseCases,
    ...commentsUseCases,
    ...postsUseCases,
    ...sessionUseCases,
  ],
})
export class AppModule {}

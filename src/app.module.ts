import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsModule } from './modules/bloggers-platform/bloggers-platform.module';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';

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

@Module({
  imports: [
    CqrsModule,
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
    PassportModule,
    MongooseModule.forRoot('mongodb://localhost:27017/Grecha'),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    UserAccountsModule,
    BlogsModule,
  ],
  providers: [...errorFilters],
  exports: [],
})
export class AppModule {}

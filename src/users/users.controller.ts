import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from './repositories/users.queryRepository';
import { UserInputDto } from './users.entity';
import { CreateUserCommand } from './user-use-cases/create-user-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from './user-use-cases/delete-user-use-case';
import { BasicAuthGuard } from '../core/guards/basic-auth-guard.service';
import { InPutPaginationWithSearchLoginTermAndSearchEMailTerm } from './validation/users.validation';
import { FinalWithPaginationType } from '../blogs/types/blog.types';
import { UserOutPut } from './types/users.types';

@Controller(`sa/users`)
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    @Inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllUsers(
    @Query() query: InPutPaginationWithSearchLoginTermAndSearchEMailTerm,
  ): Promise<FinalWithPaginationType<UserOutPut>> {
    return this.usersQueryRepository.getAllUsers(query);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() userInputDto: UserInputDto) {
    const createdUserId: string = await this.commandBus.execute(
      new CreateUserCommand(userInputDto),
    );
    return this.usersQueryRepository.findUserByUserId(createdUserId);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(`:id`)
  async deleteUser(@Param('id') userId: string) {
    await this.commandBus.execute(new DeleteUserCommand(userId));
  }
}

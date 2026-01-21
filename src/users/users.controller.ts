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
import { InPutPaginationWithSearchLoginTermAndSearchEMailTerm } from './users.trash';
import { CreateUserCommand } from './user-use-cases/create-user-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from './user-use-cases/delete-user-use-case';
import { BasicAuthGuard } from '../core/guards/basic-auth-guard.service';

@Controller(`users`)
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
  ) {
    return this.usersQueryRepository.getAllUsers(query);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() userInputDto: UserInputDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const createdUserId = await this.commandBus.execute(
      new CreateUserCommand(userInputDto),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.usersQueryRepository.findUserByUserId(createdUserId);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(`:id`)
  async deleteUser(@Param('id') userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.commandBus.execute(new DeleteUserCommand(userId));
  }
}

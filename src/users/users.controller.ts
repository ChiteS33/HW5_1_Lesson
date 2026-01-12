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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.queryRepository';
import { UserInputDto } from './users.entity';
import { InPutPaginationWithSearchLoginTermAndSearchEMailTerm } from './users.trash';

@Controller(`users`)
export class UsersController {
  constructor(
    @Inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllUsers(
    @Query() query: InPutPaginationWithSearchLoginTermAndSearchEMailTerm,
  ) {
    return this.usersQueryRepository.getAllUsers(query);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() userInputDto: UserInputDto) {
    const createdUserId = await this.usersService.createUser(userInputDto);
    return this.usersQueryRepository.findUserByUserId(createdUserId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(`:id`)
  async deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}

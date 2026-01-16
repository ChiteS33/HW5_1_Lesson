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
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.queryRepository';
import { UserInputDto } from './users.entity';
import { InPutPaginationWithSearchLoginTermAndSearchEMailTerm } from './users.trash';
import { BasicAuthGuard } from '../Auth/guards/basic-auth-guard.service';

@Controller(`users`)
export class UsersController {
  constructor(
    @Inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
    @Inject(UsersService) private usersService: UsersService,
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
    const createdUserId = await this.usersService.createUser(userInputDto);
    return this.usersQueryRepository.findUserByUserId(createdUserId);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(`:id`)
  async deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}

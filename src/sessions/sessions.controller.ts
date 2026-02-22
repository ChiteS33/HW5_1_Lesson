import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { UserDocument } from '../users/users.entity';
import { FindAllSessionsCommand } from './sessions-use-cases/find-sessions-use-case';
import { DeleteAllExcludeUserCommand } from './sessions-use-cases/delete-all-exclude-user-use-case';
import { DeleteSessionByDeviceIdCommand } from './sessions-use-cases/delete-session-by-user-use-case';
import { JwtRefreshGuard } from '../core/guards/refreshTokenGuard';
import { OutPutSessionDTO } from './types/output-dto';

@Controller('security/devices')
export class SessionsController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAllSessionForUser(
    @Req() req: Request & { user: UserDocument },
  ): Promise<OutPutSessionDTO[]> {
    const refreshToken = req.cookies.refreshToken as string;
    return this.commandBus.execute(new FindAllSessionsCommand(refreshToken));
  }
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteAllExcludeCurrent(@Req() req: Request & { user: UserDocument }) {
    const refreshToken = req.cookies.refreshToken as string;
    await this.commandBus.execute(
      new DeleteAllExcludeUserCommand(refreshToken),
    );
  }
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteByDeviceId(
    @Req() req: Request & { user: UserDocument },
    @Param('id') deviceId: string,
  ) {
    const refreshToken = req.cookies.refreshToken as string;
    await this.commandBus.execute(
      new DeleteSessionByDeviceIdCommand(deviceId, refreshToken),
    );
  }
}

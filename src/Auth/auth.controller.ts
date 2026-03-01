import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Get,
  Body,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDocument, UserInputDto } from '../users/users.entity';
import { LoginUseCommand } from './auth-use-cases/login-use-case';
import { RecoveryPasswordCommand } from './auth-use-cases/recovery-password-use-case';
import { ConfirmPasswordRecoveryCommand } from './auth-use-cases/confirm-password-use-case';
import { ConfirmRegistrationCommand } from './auth-use-cases/confirm-registration-use-case';
import { RegistrationInSystemCommand } from './auth-use-cases/registration-in-system-use-case';
import { ResendEmailResendingEmailCommand } from './auth-use-cases/resend-confirmation-email-use-case';
import { GetInfoAboutUserCommand } from './auth-use-cases/get-info-about-user-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { BearerGuard } from '../core/guards/jwt-auth.guard';
import { LocalGuard } from '../core/guards/basic-guard.service';
import {
  BodyInputDto,
  ConfirmPasswordRecovery,
  InputValidationCode,
  InputValidationEmail,
} from './validation/auth.validation';
import { LogoutCommand } from './auth-use-cases/logout-use-case';
import { RefreshTokensCommand } from './auth-use-cases/refresh-tokens-use-case';
import { JwtRefreshGuard } from '../core/guards/refreshTokenGuard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { OutPutInfoAboutMe, PairTokens } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  async recoveryPassword(@Body() dto: InputValidationEmail): Promise<void> {
    await this.commandBus.execute(new RecoveryPasswordCommand(dto.email));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  async confirmPasswordRecovery(
    @Body() dto: ConfirmPasswordRecovery,
  ): Promise<void> {
    await this.commandBus.execute(
      new ConfirmPasswordRecoveryCommand(dto.newPassword, dto.recoveryCode),
    );
  }

  @UseGuards(ThrottlerGuard, LocalGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Req() req: Request & { user: UserDocument },
    @Body() body: BodyInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens: PairTokens = await this.commandBus.execute(
      new LoginUseCommand(
        req.user,
        body,
        req.headers['user-agent'] as string,
        req.ip as string,
      ),
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 20 * 10000,
    });
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshPairTokens(
    @Req() req: Request & { user: UserDocument },
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken as string;
    const tokens: PairTokens = await this.commandBus.execute(
      new RefreshTokensCommand(refreshToken),
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 20 * 100000,
    });
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  async confirmRegistration(@Body() dto: InputValidationCode) {
    await this.commandBus.execute(new ConfirmRegistrationCommand(dto.code));
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration')
  async registrationInSystem(@Body() dto: UserInputDto) {
    await this.commandBus.execute(new RegistrationInSystemCommand(dto));
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  async resendEmail(@Body() dto: InputValidationEmail) {
    await this.commandBus.execute(
      new ResendEmailResendingEmailCommand(dto.email),
    );
  }

  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Req() req: Request & { user: UserDocument }) {
    const refreshToken = req.cookies.refreshToken as string;
    await this.commandBus.execute(new LogoutCommand(refreshToken));
    return;
  }

  @UseGuards(BearerGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async infoAboutMe(
    @Req() req: Request & { user: UserDocument },
  ): Promise<OutPutInfoAboutMe> {
    return await this.commandBus.execute(new GetInfoAboutUserCommand(req.user));
  }
}

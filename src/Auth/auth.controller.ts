import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Get,
  Body,
} from '@nestjs/common';
import {
  BodyInputDto,
  ConfirmPasswordRecovery,
  InputValidationCode,
  InputValidationEmail,
} from './auth.trash';
import { Request } from 'express';
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
import { BasicGuard } from '../core/guards/basic-guard.service';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(BasicGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Req() req: Request & { user: UserDocument },
    @Body() body: BodyInputDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.commandBus.execute(new LoginUseCommand(req.user, body));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  async recoveryPassword(@Body() dto: InputValidationEmail) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.commandBus.execute(new RecoveryPasswordCommand(dto.email));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  async confirmPasswordRecovery(@Body() dto: ConfirmPasswordRecovery) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.commandBus.execute(
      new ConfirmPasswordRecoveryCommand(dto.newPassword, dto.recoveryCode),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  async confirmRegistration(@Body() dto: InputValidationCode) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.commandBus.execute(new ConfirmRegistrationCommand(dto.code));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration')
  async registrationInSystem(@Body() dto: UserInputDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.commandBus.execute(new RegistrationInSystemCommand(dto));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  async resendEmail(@Body() dto: InputValidationEmail) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.commandBus.execute(
      new ResendEmailResendingEmailCommand(dto.email),
    );
  }

  @UseGuards(BearerGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  infoAboutMe(@Req() req: Request & { user: UserDocument }) {
    return this.commandBus.execute(new GetInfoAboutUserCommand(req.user));
  }
}

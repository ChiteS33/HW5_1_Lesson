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
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  BodyInputDto,
  ConfirmPasswordRecovery,
  InputValidationCode,
  InputValidationEmail,
  OutPutInfoAboutMe,
} from './auth.trash';
import { Request } from 'express';
import { UserDocument, UserInputDto } from '../users/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Req() req: Request & { user: UserDocument },
    @Body() body: BodyInputDto,
  ) {
    const accessToken = await this.authService.login(req.user, body);
    return { accessToken: accessToken };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  async recoveryPassword(@Body() dto: InputValidationEmail) {
    await this.authService.recoveryPassword(dto.email);
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  async confirmPasswordRecovery(@Body() dto: ConfirmPasswordRecovery) {
    await this.authService.confirmPassword(dto.newPassword, dto.recoveryCode);
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  async confirmRegistration(@Body() dto: InputValidationCode) {
    await this.authService.confirmRegistration(dto.code);
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration')
  async registrationInSystem(@Body() dto: UserInputDto) {
    await this.authService.registrationInSystem(dto);
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  async resendEmail(@Body() dto: InputValidationEmail) {
    await this.authService.resendConfirmationCode(dto.email);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  infoAboutMe(@Req() req: Request & { user: UserDocument }): OutPutInfoAboutMe {
    return {
      email: req.user.email,
      login: req.user.login,
      userId: req.user._id.toString(),
    };
  }
}

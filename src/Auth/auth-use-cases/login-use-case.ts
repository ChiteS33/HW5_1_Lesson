import { Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDocument } from '../../users/users.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtAdapter } from '../../core/adapters/jwtAdapter/jwt-adapter.service';
import { BodyInputDto } from '../validation/auth.validation';

export class LoginUseCommand {
  constructor(
    public user: UserDocument,
    public body: BodyInputDto,
  ) {}
}

@CommandHandler(LoginUseCommand)
export class LoginUseCase implements ICommandHandler<LoginUseCommand> {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(JwtAdapter) private jwtService: JwtAdapter,
  ) {}
  async execute(
    command: LoginUseCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    await this.authService.checkingUser(command.body);
    const userId = command.user._id.toString();
    const accessToken = this.jwtService.createJWT(userId);
    const refreshToken = this.jwtService.createRefreshToken(userId);
    return { accessToken, refreshToken };
  }
}

import { Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDocument } from '../../users/users.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtAdapter } from '../../core/adapters/jwtAdapter/jwt-adapter.service';
import { BodyInputDto } from '../validation/auth.validation';
import { InjectModel } from '@nestjs/mongoose';
import { SessionModelI, SessionsModel } from '../../sessions/sessions.entity';
import { SessionsRepository } from '../../sessions/repostiory/sessions.repository';

export class LoginUseCommand {
  constructor(
    public user: UserDocument,
    public body: BodyInputDto,
    public deviceName: string,
    public sessionIp: string,
  ) {}
}

@CommandHandler(LoginUseCommand)
export class LoginUseCase implements ICommandHandler<LoginUseCommand> {
  constructor(
    @InjectModel(SessionsModel.name) private sessionsModel: SessionModelI,
    @Inject(AuthService) private authService: AuthService,
    @Inject(JwtAdapter) private jwtService: JwtAdapter,
    @Inject(SessionsRepository) private sessionsRepository: SessionsRepository,
  ) {}
  async execute(
    command: LoginUseCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    await this.authService.checkingUser(command.body);
    const userId = command.user._id.toString();
    const accessToken = this.jwtService.createJWT(userId);
    const refreshToken = this.jwtService.createRefreshToken(userId);
    const payload = await this.jwtService.decodeJWT(refreshToken);

    const createdSession = this.sessionsModel.createSession(
      payload,
      command.sessionIp,
      command.deviceName,
    );
    await this.sessionsRepository.save(createdSession);
    return { accessToken, refreshToken };
  }
}

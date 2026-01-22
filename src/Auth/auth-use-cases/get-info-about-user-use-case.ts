import { UserDocument } from '../../users/users.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutPutInfoAboutMe } from '../types/auth.types';

export class GetInfoAboutUserCommand {
  constructor(public user: UserDocument) {}
}

@CommandHandler(GetInfoAboutUserCommand)
export class GetInfoAboutUserUseCase implements ICommandHandler<GetInfoAboutUserCommand> {
  constructor() {}
  async execute(command: GetInfoAboutUserCommand): Promise<OutPutInfoAboutMe> {
    return {
      email: command.user.email,
      login: command.user.login,
      userId: command.user._id.toString(),
    };
  }
}

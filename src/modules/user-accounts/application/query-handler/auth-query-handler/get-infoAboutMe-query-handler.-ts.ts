import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../../domain/entities/users.entity';
import { ViewAboutMeType } from '../../../api/view-types/auth/authViewAboutMe.type';

export class InfoAboutMeQuery {
  constructor(public user: UserDocument) {}
}

@QueryHandler(InfoAboutMeQuery)
export class InfoAboutMeQueryHandler implements IQueryHandler<InfoAboutMeQuery> {
  constructor() {}
  async execute(query: InfoAboutMeQuery): Promise<ViewAboutMeType> {
    return Promise.resolve({
      email: query.user.email,
      login: query.user.login,
      userId: query.user.id.toString(),
    });
  }
}

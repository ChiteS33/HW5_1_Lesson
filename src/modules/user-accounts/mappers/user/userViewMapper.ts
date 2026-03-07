import { UserInPutType } from '../../api/input-dto/user/userInputDto.type';
import { UserViewType } from '../../api/view-types/user/userView.type';

export const userViewMapper = (user: UserInPutType): UserViewType => {
  return {
    id: user.id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
};

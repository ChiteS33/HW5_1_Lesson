import { SessionEntityType } from '../../repositories/entity-types/session/sessionEntity.type';
import { SessionViewType } from '../../api/view-types/sessions/sessionView.type';

export const sessionViewMapper = (dto: SessionEntityType): SessionViewType => {
  return {
    ip: dto.id.toString(),
    title: dto.deviceName,
    lastActiveDate: dto.iat,
    deviceId: dto.deviceId.toString(),
  };
};

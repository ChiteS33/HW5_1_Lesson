import { SessionInDb, SessionOutPut } from '../types/output-dto';

export const outPutSessionMapper = (dto: SessionInDb): SessionOutPut => {
  return {
    ip: dto.id.toString(),
    title: dto.deviceName,
    lastActiveDate: dto.iat,
    deviceId: dto.deviceId.toString(),
  };
};

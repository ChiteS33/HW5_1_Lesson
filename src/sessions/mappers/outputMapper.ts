import { SessionsDocument } from '../sessions.entity';
import { OutPutSessionDTO } from '../types/output-dto';

export const outPutSessionMapper = (
  dto: SessionsDocument,
): OutPutSessionDTO => {
  return {
    ip: dto._id.toString(),
    title: dto.deviceName,
    lastActiveDate: dto.iat,
    deviceId: dto.deviceId,
  };
};

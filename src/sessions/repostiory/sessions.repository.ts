import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  SessionModelI,
  SessionsDocument,
  SessionsModel,
} from '../sessions.entity';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(SessionsModel.name) private sessionModel: SessionModelI,
  ) {}
  async save(session: SessionsDocument | SessionsModel): Promise<string> {
    const dataAboutSavedSession = await this.sessionModel.create(session);
    await dataAboutSavedSession.save();
    return dataAboutSavedSession._id.toString();
  }

  async findAllSessions(userId: string): Promise<any> {
    const foundSessions = await this.sessionModel.find({
      userId: userId,
      exp: { $gt: new Date().toISOString() },
    });
    return foundSessions.map(outPutSessionMapper);
  }

  async deleteAlmostAll(userId: string, deviceId: string): Promise<any> {
    await this.sessionModel.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return;
  }

  async findSessionByDeviceId(deviceId: string): Promise<any> {
    return this.sessionModel.findOne({ deviceId: deviceId });
  }

  async deleteSessionByDeviceId(deviceId: string): Promise<void> {
    await this.sessionModel.deleteOne({ deviceId: deviceId });
    return;
  }

  async findSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<any> {
    return this.sessionModel.findOne({ deviceId, userId });
  }
}

export const outPutSessionMapper = (dto: SessionsDocument) => {
  return {
    ip: dto._id.toString(),
    title: dto.deviceName,
    lastActiveDate: dto.iat,
    deviceId: dto.deviceId,
  };
};

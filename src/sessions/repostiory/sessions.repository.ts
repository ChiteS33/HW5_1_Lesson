import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  SessionModelI,
  SessionsDocument,
  SessionsModel,
} from '../sessions.entity';
import { OutPutSessionDTO } from '../types/output-dto';
import { outPutSessionMapper } from '../mappers/outputMapper';

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

  async findAllSessions(userId: string): Promise<OutPutSessionDTO[]> {
    const foundSessions = await this.sessionModel.find({
      userId: userId,
      exp: { $gt: new Date().toISOString() },
    });
    return foundSessions.map(outPutSessionMapper);
  }

  async deleteAlmostAll(userId: string, deviceId: string): Promise<void> {
    await this.sessionModel.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return;
  }

  async findSessionByDeviceId(
    deviceId: string,
  ): Promise<SessionsDocument | null> {
    return this.sessionModel.findOne({ deviceId: deviceId });
  }

  async deleteSessionByDeviceId(deviceId: string): Promise<void> {
    await this.sessionModel.deleteOne({ deviceId: deviceId });
    return;
  }

  async findSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<SessionsDocument | null> {
    return this.sessionModel.findOne({ deviceId, userId });
  }
}

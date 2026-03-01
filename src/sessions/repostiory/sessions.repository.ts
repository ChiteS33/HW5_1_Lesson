import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { SessionModelI, SessionsModel } from '../sessions.entity';
import { SessionInDb, SessionOutPut } from '../types/output-dto';
import { outPutSessionMapper } from '../mappers/outputMapper';
import { Id, Payload } from '../../common/types/common.types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(SessionsModel.name) private sessionModel: SessionModelI,
    @InjectDataSource() private datasource: DataSource,
  ) {}
  async createSession(
    payload: Payload,
    sessionIp: string,
    deviceName: string,
  ): Promise<number> {
    const createdSessionId: Id = await this.datasource.query(
      `INSERT INTO "Sessions" ("deviceId", "deviceName", "ip","userId", "exp", "iat")
    VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [
        payload.deviceId,
        deviceName,
        sessionIp,
        payload.userId,
        new Date(payload.exp * 1000).toISOString(),
        new Date(payload.iat * 1000).toISOString(),
      ],
    );

    return createdSessionId.id;
  }

  async findAllSessions(userId: string): Promise<SessionOutPut[]> {
    const foundSessions: SessionInDb[] = await this.datasource.query(
      `SELECT *
FROM "Sessions" 
WHERE "userId" = $1`,
      [userId],
    );
    return foundSessions.map(outPutSessionMapper);
  }

  async deleteAlmostAll(userId: string, deviceId: string): Promise<void> {
    await this.datasource.query(
      `DELETE FROM "Sessions"
     WHERE "userId" = $1
       AND "deviceId" <> $2`,
      [userId, deviceId],
    );
  }

  async findSessionByDeviceId(deviceId: string): Promise<SessionInDb | null> {
    const foundSession: SessionInDb[] = await this.datasource.query(
      `SELECT * FROM "Sessions" WHERE "deviceId" = $1`,
      [deviceId],
    );
    return foundSession.length === 0 ? null : foundSession[0];
  }

  async deleteSessionByDeviceId(deviceId: string): Promise<void> {
    await this.datasource.query(
      `DELETE FROM "Sessions" WHERE "deviceId" = $1`,
      [deviceId],
    );
    return;
  }

  async findSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<SessionInDb | null> {
    const foundSession: SessionInDb[] = await this.datasource.query(
      `SELECT *
      FROM "Sessions"
    WHERE "deviceId" = $1 and "userId" = $2`,
      [deviceId, userId],
    );
    return foundSession.length === 0 ? null : foundSession[0];
  }

  async updateSession(
    sessionId: number,
    iat: string,
    exp: string,
  ): Promise<void> {
    await this.datasource.query(
      `UPDATE "Sessions" SET "iat" = $1, "exp" = $2
WHERE id = $3`,
      [iat, exp, sessionId],
    );

    return;
  }
}

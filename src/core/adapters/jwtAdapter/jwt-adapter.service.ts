import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { ObjectId } from 'mongodb';
import { settings } from '../../guards/strategies/constants';

@Injectable()
export class JwtAdapter {
  constructor() {}

  createJWT(userId: string): string {
    return jwt.sign({ userId }, settings.JWT_SECRET, { expiresIn: '2h' });
  }

  async getUserIdByToken(token: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  }
  createRefreshToken(
    userId: string,
    deviceId: string = new ObjectId().toString(),
  ): string {
    const payload = { userId: userId, deviceId: deviceId };
    return jwt.sign(payload, settings.JWT_REFRESH_TOKEN, { expiresIn: '2h' });
  }

  verifyRefreshToken(token: string): string | null {
    try {
      const result: any = jwt.verify(token, settings.JWT_REFRESH_TOKEN);
      return result.userId;
    } catch (error: any) {
      console.log('Refresh token verification failed:', error.message);
      return null;
    }
  }
  decodeJWT(token: string): any {
    return jwtDecode(token);
  }
}

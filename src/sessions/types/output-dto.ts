export type SessionInDb = {
  id: number;
  userId: number;
  deviceId: number;
  iat: string;
  deviceName: string;
  ip: string;
  exp: string;
};

export type SessionOutPut = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};

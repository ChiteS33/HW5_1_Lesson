import { ConfigModule } from '@nestjs/config';

export const configModule = ConfigModule.forRoot({
  envFilePath: [
    // @ts-ignore
    process.env.ENV_FILE_PATH?.trim(),
    `.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    `.env.production`,
  ],
  isGlobal: true,
});

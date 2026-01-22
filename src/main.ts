import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSetup(app);
  app.enableCors();
  app.use(cookieParser());
  const port = process.env.PORT || 5002;
  await app.listen(port);
  console.log('Server is running on port: ' + port);
}
bootstrap();

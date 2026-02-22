import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export const IsRefreshTokenValid = (refreshToken: string) => {
  applyDecorators(
    IsString(),
    IsNotEmpty(),
    Matches(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
  );
};

// @IsString()
// @IsNotEmpty()
// @Matches(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
// refreshToken: string;

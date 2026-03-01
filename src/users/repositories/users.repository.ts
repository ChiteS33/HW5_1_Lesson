import { Injectable } from '@nestjs/common';
import { UserDocument, UserInputDto, UserModel } from '../users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Id } from '../../common/types/common.types';
import { UserInDB } from '../types/users.types';
import { add } from 'date-fns';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel.name)
    private UserModel: Model<UserDocument>,
    @InjectDataSource() private datasource: DataSource,
  ) {}

  async saveUserByAdmin(
    login: string,
    email: string,
    hash: string,
  ): Promise<string> {
    const createdUserId: Id[] = await this.datasource.query<Id[]>(
      'INSERT INTO "Users" ("login", "email", "passwordHash", "createdAt") VALUES ($1, $2, $3, NOW()) RETURNING "id"',
      [login, email, hash],
    );

    return createdUserId[0].id.toString();
  }

  async saveUser(body: UserInputDto, passwordHash: string): Promise<number> {
    const createdUserId: Id[] = await this.datasource.query(
      `INSERT INTO "Users" ("login", "email", "passwordHash", "createdAt", "confirmationCode", "expirationDate", "isConfirmed")
  VALUES ($1, $2, $3, $4, $5, $6, $7 )
  RETURNING id`,
      [
        body.login,
        body.email,
        passwordHash,
        new Date(),
        crypto.randomUUID(),
        add(new Date(), { hours: 4 }),
        false,
      ],
    );
    return createdUserId[0].id;
  }

  async findUserById(userId: string): Promise<UserInDB | null> {
    const foundUser: UserInDB[] = await this.datasource.query(
      'SELECT * FROM "Users" WHERE id = $1',
      [userId],
    );
    return foundUser.length === 0 ? null : foundUser[0];
  }

  async deleteUserById(userId: string): Promise<void> {
    await this.datasource.query(`DELETE FROM "Users" WHERE id = $1`, [userId]);
    return;
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserInDB | null> {
    const foundUser: UserInDB[] = await this.datasource.query(
      `SELECT * FROM "Users" WHERE "login" = $1 OR "email" = $1`,
      [loginOrEmail],
    );
    return foundUser.length === 0 ? null : foundUser[0];
  }

  async findUserByConfirmationCode(code: string): Promise<UserInDB | null> {
    const foundUser: UserInDB[] = await this.datasource.query(
      `SELECT * FROM "Users" WHERE "confirmationCode" = $1`,
      [code],
    );
    return foundUser.length === 0 ? null : foundUser[0];
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<UserInDB | null> {
    const foundUser: UserInDB[] = await this.datasource.query(
      `SELECT * FROM "Users"
     WHERE "recoveryCode" = $1`,
      [recoveryCode],
    );
    return foundUser.length === 0 ? null : foundUser[0];
  }

  async findUserByEmail(email: string): Promise<UserInDB | null> {
    const foundUser: UserInDB[] = await this.datasource.query(
      'SELECT * FROM "Users" WHERE "email" = $1',
      [email],
    );
    return foundUser.length === 0 ? null : foundUser[0];
  }

  async findUserByLogin(login: string): Promise<UserInDB | null> {
    const foundUser: UserInDB[] = await this.datasource.query(
      'SELECT * FROM "Users" WHERE "login" = $1',
      [login],
    );
    return foundUser.length === 0 ? null : foundUser[0];
  }

  async updateRecoveryCode(
    userId: number,
    recoveryCode: string,
  ): Promise<void> {
    await this.datasource.query(
      `UPDATE "Users" 
    SET "recoveryCode" = $1
    WHERE "id" = $2`,
      [recoveryCode, userId.toString()],
    );
    return;
  }

  async updatePassword(userId: number, passwordHash: string): Promise<void> {
    await this.datasource.query(
      `UPDATE "Users" SET "passwordHas" = $1 WHERE "userId" = $2`,
      [passwordHash, userId],
    );
  }

  async refreshConfirmationCode(
    newConfirmationCode: string,
    newExpDate: Date,
    userId: number,
  ): Promise<void> {
    await this.datasource.query(
      `UPDATE "Users" SET "confirmationCode" = $1, "expirationDate" = $2
    WHERE id = $3`,
      [newConfirmationCode, newExpDate, userId],
    );
    return;
  }

  async changeConfirmationStatus(
    status: boolean,
    userId: number,
  ): Promise<void> {
    await this.datasource.query(
      `UPDATE "Users" SET "isConfirmed" = $1
     WHERE id = $2`,
      [status, userId],
    );
    return;
  }
}

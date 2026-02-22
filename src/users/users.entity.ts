import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { add } from 'date-fns';
import { Matches } from 'class-validator';
import { IsStringWithTrim } from '../core/decorators/validation/is-string-with-trim';

export type UserDocument = HydratedDocument<UserModel>;

export type UserInputDtoForCreate = {
  login: string;
  email: string;
  passwordHash: string;
};

export class UserInputDto {
  @IsStringWithTrim(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;
  @IsStringWithTrim(6, 20)
  password: string;
  @IsStringWithTrim(1, 100)
  @Matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
  email: string;
}

@Schema()
export class EmailConfirmation {
  @Prop({ type: String, nullable: true }) confirmationCode: string | null;
  @Prop({ type: Date, nullable: true }) expirationDate: Date | null;
  @Prop({ type: Boolean }) isConfirmed: boolean;
}

@Schema()
export class RecoveryData {
  @Prop({ type: String, nullable: true, default: null }) recoveryCode:
    | string
    | null;
}

@Schema({ versionKey: false })
export class UserModel {
  @Prop({ type: String }) login: string;
  @Prop({ type: String }) email: string;
  @Prop({ type: String }) passwordHash: string;
  @Prop({ type: Date }) createdAt: Date;
  @Prop({ _id: false, type: EmailConfirmation })
  emailConfirmation: EmailConfirmation;
  @Prop({ _id: false, type: RecoveryData }) recoveryData: RecoveryData;

  public static createUserByAdmin(body: UserInputDtoForCreate): UserModel {
    const emailConf = {
      confirmationCode: null,
      expirationDate: new Date(),
      isConfirmed: true,
    };
    const newUser = new UserModel();
    newUser.login = body.login;
    newUser.email = body.email;
    newUser.passwordHash = body.passwordHash;
    newUser.createdAt = new Date();
    newUser.emailConfirmation = emailConf;
    newUser.recoveryData = {
      recoveryCode: null,
    };
    return newUser;
  }

  public static createUser(
    body: UserInputDto,
    passwordHash: string,
  ): UserModel {
    const emailConf = {
      confirmationCode: crypto.randomUUID(),
      expirationDate: add(new Date(), { hours: 1 }),
      isConfirmed: false,
    };
    const newUser = new UserModel();
    newUser.login = body.login;
    newUser.email = body.email;
    newUser.passwordHash = passwordHash;
    newUser.createdAt = new Date();
    newUser.emailConfirmation = emailConf;
    newUser.recoveryData = {
      recoveryCode: null,
    };
    return newUser;
  }
  changeConfirmationStatus(status: boolean) {
    this.emailConfirmation.isConfirmed = status;
    return;
  }
  recoveryCode() {
    this.recoveryData.recoveryCode = crypto.randomUUID();
    return;
  }
  refreshConfirmationCode() {
    this.emailConfirmation.confirmationCode = crypto.randomUUID();
    this.emailConfirmation.expirationDate = add(new Date(), { hours: 1 });
    return;
  }
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
UserSchema.loadClass(UserModel);
export interface UserModelI extends Model<UserDocument> {
  createUserByAdmin(dto: UserInputDtoForCreate): UserModel;
}

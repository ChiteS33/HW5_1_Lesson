import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

export type UserInputDtoForCreate = {
  login: string;
  email: string;
  passwordHash: string;
};

export type UserInputDto = {
  login: string;
  password: string;
  email: string;
};

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

  public static createUserByAdmin(dto: UserInputDtoForCreate): UserModel {
    const emailConf = {
      confirmationCode: null,
      expirationDate: new Date(),
      isConfirmed: true,
    };
    const newUser = new UserModel();
    newUser.login = dto.login;
    newUser.email = dto.email;
    newUser.passwordHash = dto.passwordHash;
    newUser.createdAt = new Date();
    newUser.emailConfirmation = emailConf;
    newUser.recoveryData = {
      recoveryCode: null,
    };
    return newUser;
  }
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
UserSchema.loadClass(UserModel);
export interface UserModelI extends Model<UserDocument> {
  createUserByAdmin(dto: UserInputDtoForCreate): UserModel;
}

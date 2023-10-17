import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const USER_SCHEMA_NAME = 'user';

@Schema({ collection: USER_SCHEMA_NAME })
export class UserRepo {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export type UserDocument = UserRepo & Document;

export const UserSchema = SchemaFactory.createForClass(UserRepo);

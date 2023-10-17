import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRepo } from './user.schema';

@Schema({ collection: 'customer' })
export class CustomerRepo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: UserRepo;
}

export type CustomerDocument = CustomerRepo & Document;

export const CustomerSchema = SchemaFactory.createForClass(CustomerRepo);

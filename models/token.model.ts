import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IToken } from 'interfaces/token.interface';
import { Document } from 'mongoose';

@Schema()
export class Token extends Document implements IToken {
  @Prop({ type: String, required: true })
  refresh_token: string;
  @Prop({ type: String, required: true })
  access_token: string;
  @Prop({ type: Number, required: true })
  refresh_time: number;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

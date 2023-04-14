import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class ProfileDetail {

  @Prop()
  avatar: string;

  @Prop()
  mySkill: string;

  @Prop()
  occupation: string;

  @Prop({ default: 'new seller' })
  level: string;
}


@Schema({ timestamps: true })
export class Profile extends Document {
    @Prop({ required: true })
    email: string;

//   @Prop({ required: true })
//   infor_id: number;

    @Prop({ required: true })
    first_name: string;

    @Prop()
    last_name: string;

    @Prop()
    gender: string;

    @Prop({ required: true })
    birthday: Date;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    education: string;


    @Prop()
    profileDetail: ProfileDetail;
}
export const ProfileSchema = SchemaFactory.createForClass(Profile);

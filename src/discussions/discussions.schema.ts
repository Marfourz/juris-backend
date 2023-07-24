import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import { User } from "../users/users.schema";
import mongoose, { HydratedDocument } from "mongoose";

export type DiscussionDocument = HydratedDocument<Discussion>;
@Schema({
    timestamps: true
})
export class Discussion{
    @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'User'})
    user: User

   
    @Prop()
    name: string
}


export const DiscussionSchema = SchemaFactory.createForClass(Discussion)
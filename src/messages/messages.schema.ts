import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "../users/users.schema";
import { Discussion } from "../discussions/discussions.schema";

export enum MessageType{
    CHATBOT = 'CHATBOT',
    USER = 'USER'
} 

export type MessageDocument = HydratedDocument<Message>;

@Schema({
    timestamps: true
})
export class Message{

    @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'Discussion'})
    discussion: Discussion

    @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'Message'})
    responseToMsg: Message

    @Prop()
    text: string

    @Prop()
    type: 'CHATBOT' | 'USER'
}


export const MessageSchema = SchemaFactory.createForClass( Message)
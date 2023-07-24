import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true, 
    toJSON:{
        transform : (doc,ret)=>{
            delete ret.password
            return ret
        }
    }
})
export class User{
    @Prop({required:true,unique:true})
    email:string

    @Prop({required:true,unique:true})
    username:string

    @Prop({required:true})
    firstname:string

    @Prop({required:true})
    lastname:string

    @Prop({required:true})
    password:string

    @Prop()
    photoUrl:string

    @Prop({default : Date.now()})
    createdAt : Date

    @Prop()
    updatatedAt : Date

}

export const UserSchema = SchemaFactory.createForClass(User)
import mongoose from "mongoose";
import { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema({
    name:String,
    username:String,
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    },
    cart:[
        {
            type:Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
})

userSchema.pre('save',async function (next){
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(this.password,salt);
    this.password = hash;
    next();
})

userSchema.methods.genToken = async function () {
    let token = await jwt.sign({_id:this._id},JWT_SECRET_KEY);
    return token
}

const User = mongoose.model('User',userSchema)

export default User;
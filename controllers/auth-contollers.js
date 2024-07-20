import User from "../models/user-model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const cookieOptions = {
    maxAge: new Date(Date.now() + 1000 * 60 * 60 * 12)
}


export const registerUser = async (req, res, next) => {
    try {
        console.log('Register API Working')
        let { name, username, email, password } = req.body;
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(409).json({
                error: 'user already exists with particular username/email'
            })
        }
        let newUser = await User({
            name, username, email, password
        })
        await newUser.save();

        let cookieToken = await newUser.genToken()

        res.cookie('token', cookieToken, cookieOptions);
        return res.status(200).json({
            message: 'user registered successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'INTERNAL SERVER ERROR'
        })
    }
}

export const loginUser = async (req, res, next) => {

    try {
        console.log('Login API Working')
        let { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: 'User Not Found'
            })
        }

        let verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) {
            return res.status(401).json({
                error: 'Wrong Credentials'
            })
        }

        let cookieToken = await user.genToken()

        res.cookie('token', cookieToken, cookieOptions);
        return res.status(200).json({
            message: 'user login successfully',
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Internal Server Error'
        })
    }

}

export const logoutUser = async (req, res, next) => {
    try {
        console.log('Logout API Working')
        res.clearCookie('token');
        return res.status(200).json({
            message:'Logout Successfull'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'internal server error'
        })
    }

}

export const isUserLoggedIn = async (req, res, next) =>{
    try {
        if(!req.cookies && !req.cookies.token || Object.keys(req.cookies).length === 0){
            return res.status(401).json({
                error:'User Not Logged In'
            })
        }
        if(req.cookies && req.cookies.token) {
            let userToken = req.cookies.token;
            let verifyToken = await jwt.verify(userToken,JWT_SECRET_KEY);
            if(!verifyToken){
                return res.status(401).json({
                    error:'User Not Logged In'
                })
            }
            let { _id } = verifyToken;
            let user = await User.findById(_id);
            if(!user){
                return res.status(404).json({
                    error:'No User with that token exists'
                })
            }
            return res.status(200).json({
                message:'User Already Logged In',
                user:{
                    _id: user._id,
                    name : user.name ,
                    username : user.username ,
                    email : user.email
                }

            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
    }
}
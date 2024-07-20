import jwt from 'jsonwebtoken'
import User from '../models/user-model.js';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const isAuthenticated = async (req, res, next) =>{
    try {
        if(Object.keys(req.cookies).length === 0 || !req.cookies.token){
            return res.status(401).json({
                error:'User is not Authenticated'
            })
        }
        let token = req.cookies.token;
        let verifyToken = await jwt.verify(token,JWT_SECRET_KEY);
        if(!verifyToken){
            return res.json({
                error:'User is not Authenticated'
            })
        }
        let {_id} = verifyToken;
        if(!_id){
            return res.status(401).json({
                error:'User is not Authenticated'
            })
        }
        let user = await User.findById(_id);
        if(!user){
            return res.status(401).json({
                error:'User is not Authenticated'
            })        }
        req.user = user;
        return next();

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'INTERNAL SERVER ERROR'
        })
    }
}
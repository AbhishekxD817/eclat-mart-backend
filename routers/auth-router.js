import { Router } from "express";
import { registerUser , loginUser , logoutUser , isUserLoggedIn } from '../controllers/auth-contollers.js'

const authRouter = Router()


authRouter.route('/auth')
.get(isUserLoggedIn)

authRouter.route('/register')
.post(registerUser)

authRouter.route('/login')
.post(loginUser)

authRouter.route('/logout')
.get(logoutUser)


export default authRouter;
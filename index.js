import express from 'express'
import 'dotenv/config'
import connectMongoDB from './utils/database.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRouter from './routers/auth-router.js';
import productRouter from './routers/products-router.js';

const app = express()
const PORT = process.env.PORT || 7777;

app.listen(PORT,async ()=>{
    console.log('> Server Started => http://localhost:'+PORT);
    await connectMongoDB()
})

const corsOptions = {
    origin:'https://eclat-mart-ecommerce.onrender.com',
    credentials:true,
    optionsSuccessStatus:200
}

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))





















app.use('/',authRouter);
app.use('/products',productRouter)
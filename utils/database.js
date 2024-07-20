import mongoose from "mongoose";
import 'dotenv/config'

const MONGO_URL = process.env.MONGO_URL;

const connectMongoDB = async () =>{
    try {
        const db = await mongoose.connect(MONGO_URL)
        console.log('> MongoDB connected')
    } catch (error) {
        console.log(error)
    }
}
export default connectMongoDB;
import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = Schema({
    name:String,
    price:Number,
    category:String,
    company:String,
    image:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})


const Product = mongoose.model('Product',productSchema);

export default Product;
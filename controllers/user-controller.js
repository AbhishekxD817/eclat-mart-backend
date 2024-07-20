import Product from '../models/product-model.js'
import User from '../models/user-model.js';

export const getAllProducts = async (req, res, next) => {
    try {
        console.log('GET ALL PRODUCTS API working')
        let allProducts = await Product.find();
        return res.json({
            products: allProducts
        })
    } catch (error) {
        console.log(error)
    }
}

export const addProduct = async (req, res, next) => {
    try {
        let user = req.user;
        let { name, price , category , company } = req.body;
        let newProduct = await Product({
            name, price, category , company , 
            owner: user._id ,
            image:req.file.path
        })

        await newProduct.save();
        return res.json({
            message: 'Product Added Successfully',
            product: {
                name, price, id: newProduct._id ,  category , company 
            }
        })

    } catch (error) {
        console.log(error)
        return res.json({
            error: 'Something went wrong'
        })
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        console.log('delete PRODUCT API working')
        let user = req.user;
        let { pid } = req.params;
        let product = await Product.findById(pid)
        if (!product) {
            return res.json({
                error: 'No Product found with this product id'
            })
        }
        if (!user._id.equals(product.owner._id)) {
            return res.json({
                error: "You dont have Permissions"
            })
        }
        await Product.findByIdAndDelete(pid);
        return res.json({
            message: 'Product Deleted Successfully'
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        console.log('update PRODUCT API working')
        console.log(req.body)
        let user = req.user;
        let { pid } = req.params;
        console.log(pid)
        let product = await Product.findById(pid)
        if (!product) {
            return res.status(404).json({
                error: 'No Product found with this product id'
            })
        }
        if (!user._id.equals(product.owner._id)) {
            return res.status(401).json({
                error: "You dont have Permissions"
            })
        }
        let { name, price ,  category , company } = req.body;

        if (name) {
            product.name = name;
        }
        if (price) {
            product.price = price;
        }
        if(category){
            product.category = category;
        }
        if(company){
            product.company = company;
        }
        await product.save();

        return res.status(200).json({
            message: 'Product updated successfully'
        })
    } catch (error) {
        console.log(error)
    }
}


export const getSingleProduct = async (req, res, next) =>{
    console.log('hitting single')
    try {
        let { pid } = req.params;
        let user = await User.findById(req.user._id);
        let product = await Product.findById(pid)
        if(!product){
            return res.json({
                error:'No Product found'
            })
        }

        let addedToCart = user.cart.includes(pid);
        return res.json({
            message:'Product Fetched',
            product:product,
            addedToCart
        })
    } catch (error) {
        console.log(error)
        return res.json({
            error:'something went wrong while getting product'
        })
    }
}

export const searchProducts = async (req,res,next) =>{
    try {
        let result = await Product.find({
            $or:[
                { name: {$regex: req.params.key } }
            ]
        })
        return res.json({
            result
        });
    } catch (error) {
        console.log(error)
    }
}



export const addToCart = async (req, res , next ) =>{
    try {
        let {pid} = req.params;
        let user = await User.findById(req.user._id);
        user.cart.push(pid);
        await user.save();
        return res.status(200).json({
            message:'Product Added To Cart'
        })
    } catch (error) {
        return req.status(500).json({
            error:'Internal server error'
        })
    }
}


export const deleteFromCart = async (req,res, next) =>{
    try {
        let {pid} = req.params;
        let user = await User.findById(req.user._id);
        let idx =await user.cart.indexOf(pid);
        if(idx > -1){
            let arr = user.cart.splice(idx,1);
            await user.save()
            return res.status(200).json({
                message:'Removed From Cart'
            })
        }
        return res.status(404).json({
            message:'something sus'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Internal Server Error'
        })
    }
}


export const userCart = async (req,res, next) =>{
    try {
        console.log('in user cart')
        let user = await User.findById(req.user._id).populate('cart')
        let userCart = user.cart;
        return res.status(200).json({
            cart:userCart
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Internal Server Error'
        })
    }
}
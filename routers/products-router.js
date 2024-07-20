import { Router } from "express";
import { userCart , addToCart, deleteFromCart, searchProducts , getSingleProduct , getAllProducts , addProduct, deleteProduct, updateProduct} from '../controllers/user-controller.js'
import { isAuthenticated } from "../middlewares/Auth.js";
import multer from "multer";
import { storage } from "../utils/cloudConfig.js";
const upload = multer({storage})


const productRouter = Router();


productRouter.route('/')
.get(getAllProducts)
.post(isAuthenticated,
    upload.single('image')
    ,addProduct)


productRouter.route('/cart')
.get(isAuthenticated,userCart)



productRouter.route('/:pid')
.get(isAuthenticated,getSingleProduct)
.patch(isAuthenticated,updateProduct)
.delete(isAuthenticated,deleteProduct)

productRouter.route('/:pid/cart')
.post(isAuthenticated,addToCart)
.delete(isAuthenticated,deleteFromCart)

productRouter.route('/search/:key')
.get(isAuthenticated,searchProducts)



export default productRouter;
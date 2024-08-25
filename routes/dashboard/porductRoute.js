const productController = require('../../controller/dashboard/productController')
const { authMiddleware } = require('../../middleware/authMiddleware')




const productRouter = require('express').Router()

productRouter.post('/add-product',authMiddleware, productController.add_product)
productRouter.get('/get-products',authMiddleware, productController.get_products)
productRouter.get('/get-product/:productId',authMiddleware, productController.get_product)
productRouter.post('/update-product',authMiddleware, productController.update_product)
productRouter.post('/update-image-product',authMiddleware, productController.update_image_product)


module.exports = productRouter
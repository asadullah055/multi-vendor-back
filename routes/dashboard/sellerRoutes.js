
const sellerController = require('../../controller/dashboard/sellerController')
const { authMiddleware } = require('../../middleware/authMiddleware')




const sellerRouter = require('express').Router()

sellerRouter.get('/get-seller-request',authMiddleware, sellerController.get_seller_request)
sellerRouter.get('/get-seller/:sellerId',authMiddleware, sellerController.get_seller)
sellerRouter.post('/seller-status-update',authMiddleware, sellerController.seller_status_update)



module.exports = sellerRouter
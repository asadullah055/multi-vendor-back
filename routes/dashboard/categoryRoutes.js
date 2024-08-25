const categoryController = require('../../controller/dashboard/categoryController')
const { authMiddleware } = require('../../middleware/authMiddleware')



const categoryRouter = require('express').Router()

categoryRouter.post('/add-category',authMiddleware, categoryController.add_category)
categoryRouter.get('/get-category',authMiddleware, categoryController.get_category)


module.exports = categoryRouter
const authController = require('../controller/authController')
const { authMiddleware } = require('../middleware/authMiddleware')

const authRouter = require('express').Router()

authRouter.post('/admin-login', authController.admin_login)
authRouter.get('/get-user', authMiddleware, authController.getUer)

module.exports = authRouter
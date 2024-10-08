
const express = require('express')
const authRouter = require('./routes/authRoutes')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dbConnect = require('./utils/db')

const categoryRouter = require('./routes/dashboard/categoryRoutes')
const productRouter = require('./routes/dashboard/porductRoute')
const sellerRouter = require('./routes/dashboard/sellerRoutes')
const homeRouter = require('./routes/home/homeRoute')
const customerAuthRouter = require('./routes/home/customerAuthRoute')
app.use(bodyParser.json({}))
app.use(bodyParser.json({}))
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))
app.use(cookieParser())

app.use('/api', authRouter)
app.use('/api', categoryRouter)
app.use('/api', productRouter)
app.use('/api', sellerRouter)
app.use('/api/home', homeRouter)
app.use('/api/home', customerAuthRouter)

app.get('/',(req, res)=>res.send('hello world'))
dbConnect()
app.listen(port, ()=>console.log(`server is running on port ${port}`))
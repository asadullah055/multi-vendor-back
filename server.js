
const express = require('express')
const authRouter = require('./routes/authRoutes')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dbConnect = require('./utils/db')
app.use(bodyParser.json({}))
app.use(bodyParser.json({}))
app.use(cors({
    origin: ['http://localhost:5173',],
    credentials: true
}))
app.use(cookieParser())

app.use('/api', authRouter)

app.get('/',(req, res)=>res.send('hello world'))
dbConnect()
app.listen(port, ()=>console.log(`server is running on port ${port}`))
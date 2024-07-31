

const jwt = require('jsonwebtoken')


const createToken = async (data)=>{
    const token = jwt.sign(data, process.env.SECRET, {expiresIn: '7d'})
    return token
}

module.exports = createToken
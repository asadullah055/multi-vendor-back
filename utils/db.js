
const mongoose = require('mongoose')

const dbConnect = async()=>{
    try {
        await mongoose.connect(process.env.MONGOURL)
        console.log('database connect successful');
    } catch (error) {
      console.log(error.message);  
    }
}

module.exports =dbConnect
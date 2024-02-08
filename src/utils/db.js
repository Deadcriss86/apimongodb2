const mongoose = require('mongoose')
const URI = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.sout1wq.mongodb.net/apiMongoDb`
async function connect() {

    try {
      let connection = await mongoose.connect(URI)
      if (connection) console.log("Conexion a BD establecida")  
    } catch (error) {
       throw new Error(error)
    }
   
}

function disconnect() {
    mongoose.disconnect()
}

module.exports = {
    connect,
    disconnect
}
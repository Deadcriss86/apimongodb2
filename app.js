require('dotenv').config()
const express = require('express')
const app = express()
const port = 3002
const { connect } = require('./src/utils/db')
//const { verifyJWT } = require('./src/middlewares/authentication')

//import paths
const usersRoute = require('./src/routes/users')
const postRoute = require("./src/routes/createPost")

//conectar la base de datos
connect()


app.use(express.json())

app.get('/', (req, res) => {
   res.send({ msg: 'API Rest mongodb' }) 
})

//app.use(verifyJWT)
app.use('/users', usersRoute)
app.use(`/post`, postRoute )

app.listen(port, () => {
    console.log('Server is ready')
})

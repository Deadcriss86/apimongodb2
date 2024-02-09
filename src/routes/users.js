const express = require('express')
const router = express.Router()
//const readFile = require('../utils/readFile')
const User = require('../models/users')
const { createJWT, verifyJWT } = require('../middlewares/authentication')
//const { isAdmin } = require('../middlewares/authorization')
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.send({ msg: "All users", data: users })
    } catch (error) {
        res.status(400).send({ msg: "can't get users", error: error }) 
    }  
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id)
        res.send({ msg: "user", data: user })
    } catch (error) {
        res.status(400).send({ msg: "can't get user", error: error })
    }
})

router.post('/', async (req, res) => {
    try {
        const newUser = req.body
        let user = await User.create(newUser)
        await user.save()
        res.status(201).send({ msg: "user created", data: user})
    } catch (error) {
        if (error.code) {
            switch (error.code) {
                case 11000:
                    res.status(400).send({ msg: "user not created", error: "Email ya registrado"})
                    break;
            
                default:
                    res.status(400).send({ msg: "user not created", error: error})
                    break;
            }
            
        }
    }
})

router.post('/login', async (req, res) => {
    try {
        const credential = req.body
        const user = await User.findOne({email: credential.email})
        if (!user) {
            res.status(401).send({msg: "user not found"})
        }else{
            if (user.password != credential.password) {
                res.status(401).send({msg: "invalid password"})
            } else {
                const token = createJWT({_id: user._id})
                res.send({msg: "login user", data: token})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({msg: "login ivalid", error: error})
    }   
})

router.use(verifyJWT)

router.put('/:id', async (req, res) => {
    try {
        console.log(req.user) 
        const id = req.params.id
        const userUpdate = req.body.email
        const passwordUpdate = req.body.password
        if (id != req.user._id) {
            res.status(401).send({msg: "user not authorized"}) 
        } else {
            const result = await User.findByIdAndUpdate(id, {$set: {
                email: userUpdate,
                password: passwordUpdate
            }})
            res.status(201).send({msg: "user updated", data: result})
        }
        
    } catch (error) {
        res.status(400).send({msg: "user not updated"})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        console.log(req.user) 
        const id = req.params.id
        if (id != req.user._id) {
            res.status(401).send({msg: "user not authorized"}) 
        } else {
            const result = await User.findByIdAndDelete(id)
            res.status(201).send({msg: "user removed", data: result})
        }
        
    } catch (error) {
        res.status(400).send({msg: "user not removed"})
    }
     
})


module.exports = router
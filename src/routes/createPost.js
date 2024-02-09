const express = require('express')
const router = express.Router()
const Post = require("../models/post")
const { verifyJWT } = require('../middlewares/authentication')


router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
        res.send({ msg: "All users", data: posts })
    } catch (error) {
        res.status(400).send({ msg: "can't get posts", error: error }) 
    }  
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const post = await Post.findById(id)
        res.send({ msg: "post", data: post  })
    } catch (error) {
        res.status(400).send({ msg: "can't get post", error: error })
    }
})

router.use(verifyJWT)

router.post('/', async (req, res) => {
    try {
        const newPost = req.body
        let post = await Post.create(newPost)
        await post.save()
        res.status(201).send({ msg: "post created", data: newPost})
    } catch (error) {
        res.status(400).send({ msg: "user not created", error: error})
    }   
})

router.put('/:id', async (req, res) => {
    try {
        console.log(req.user) 
        const id = req.params.id
        const userUpdate = req.body.email
        const passwordUpdate = req.body.password
        if (id != req.user._id) {
            res.status(401).send({msg: "user not authorized"}) 
        } else {
            const result = await Post.findByIdAndUpdate(id, {$set: {
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
            const result = await Post.findByIdAndDelete(id)
            res.status(201).send({msg: "user removed", data: result})
        }
        
    } catch (error) {
        res.status(400).send({msg: "user not removed"})
    }
     
})


module.exports = router
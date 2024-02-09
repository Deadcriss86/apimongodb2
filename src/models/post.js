const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user: {
        type: String,required: true
    },
    detalles: {
        type: String,required: true
    },
    urlImage: {
        type: String,required: true
    },
    titulo: {
        type: String,required: true
    },
},
{
    timestamps: true,
});


const Post = mongoose.model('posts', userSchema)

module.exports = Post
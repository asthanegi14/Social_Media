const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    name:{
        type: String
    },
    userImage:{
        type: String
    },
    text: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [commentSchema] 
});

module.exports = mongoose.model('Post', postSchema);

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: String,
    image: String,
    category: String,
    content: String,
    slug: String,
    autor: String,
    views: Number
},{collection: 'posts'})

const Posts = mongoose.model('posts', postSchema)

module.exports = Posts
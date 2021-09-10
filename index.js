const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')

const Posts = require('./posts')

mongoose.connect('mongodb+srv://root:hdSvjxBUeuCmHFkw@cluster0.gita2.mongodb.net/PortalNews?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('connected with success!'))
.catch((err) => console.log(err.message))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use('/public', express.static(path.join(__dirname, '/public')))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    if (req.query.search == null){
        Posts.find({}).sort({'_id': -1}).exec((err, posts) => {
            posts = posts.map((val) => {
                return {
                    title: val.title,
                    content: val.content,
                    description: val.content.substr(0, 150),
                    image: val.image,
                    slug: val.slug,
                    autor: val.autor,
                    category: val.category,
                }
            })

            Posts.find({}).sort({'views': -1}).limit(6).exec((err, postsTop) => {
            postsTop = postsTop.map((val) => {
                return {
                    title: val.title,
                    content: val.content,
                    description: val.content.substr(0, 80),
                    image: val.image,
                    slug: val.slug,
                    autor: val.autor,
                    category: val.category,
                    views: val.views
                }
            })

            console.log(posts)
            res.render('home', {posts: posts, postsTop: postsTop})
            })
        })
        
    }else {
        Posts.find({title: {$regex: req.query.search, $options: 'i'}}, (err, posts) => {
            posts = posts.map((val) => {
                return {
                    title: val.title,
                    content: val.content,
                    description: val.content.substr(0, 100),
                    image: val.image,
                    slug: val.slug,
                    autor: val.autor,
                    category: val.category,
                }
            })
            res.render('search', {posts: posts, contagem: posts.length})
        })
    }
})

app.get('/:slug', (req, res) => {
    Posts.findOneAndUpdate({slug: req.params.slug}, {$inc: {views: 1}}, {new: true}, (err, response) => {
        if (response != null){
            Posts.find({}).sort({'_id': -1}).exec((err, posts) => {
    
                Posts.find({}).sort({'views': -1}).limit(6).exec((err, postsTop) => {
                postsTop = postsTop.map((val) => {
                    return {
                        title: val.title,
                        content: val.content,
                        description: val.content.substr(0, 80),
                        image: val.image,
                        slug: val.slug,
                        autor: val.autor,
                        category: val.category,
                        views: val.views
                    }
                })
    
                res.render('single', {notice: response, postsTop: postsTop})
                })
            })
        } else {
            res.redirect('/')
        }
    })
})

app.listen(6262, () => console.log('Server 6262 is running!'))
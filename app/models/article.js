var mongoose = require('mongoose')
var ArticleSchema = require('../schemas/article')

//发布Article这个model
var Article = mongoose.model('Article', ArticleSchema)

module.exports = Article
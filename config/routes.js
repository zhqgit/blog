var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')
var Catetory = require('../app/controllers/catetory')
var Article = require('../app/controllers/article')

var Collection = require('../app/controllers/collection')

var Upload = require('../app/controllers/server-for-cros')

var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()

module.exports = function (app) {

  // pre handle user
  app.use(function (req, res, next) {
    var _user = req.session.user

    app.locals.user = _user

    next()
  })

  // Index
  app.get('/', Index.index)

  // User
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/signin', User.showSignin)
  app.get('/signup', User.showSignup)
  app.get('/logout', User.logout)
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

  // Movie
  app.get('/movie/:id', Movie.detail)
  app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
  app.post('/admin/movie', multipartMiddleware, User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save)
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
  app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

  // Article
  app.get('/article/:id', Article.pagedetail)
  app.get('/admin/article/new', User.signinRequired, User.adminRequired, Article.new)
  app.get('/admin/article/update/:id', User.signinRequired, User.adminRequired, Article.update)
  app.post('/admin/article', multipartMiddleware, User.signinRequired, User.adminRequired, Article.save)
  app.get('/admin/article/list', User.signinRequired, User.adminRequired, Article.list)
  app.get('/admin/article/weblist', Article.weblist)
  app.get('/admin/article/lifelist', Article.lifelist)
  app.get('/admin/article/my', Article.mydetail)
  app.get('/admin/article/resume', Article.resume)
  app.delete('/admin/article/list', User.signinRequired, User.adminRequired, Article.del)

  // Comment
  app.post('/user/comment', User.signinRequired, Comment.save)

  // Article
  app.post('/user/article', User.signinRequired, Article.save)

  // Category
  app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)
  app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save)
  app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)

  // Catetory
  app.get('/admin/catetory/new', User.signinRequired, User.adminRequired, Catetory.new)
  app.post('/admin/catetory', User.signinRequired, User.adminRequired, Catetory.save)
  app.get('/admin/catetory/list', User.signinRequired, User.adminRequired, Catetory.list)

  //Collection
  app.get('/collectionlist', Collection.list)



  // results
  app.get('/results', Index.search)

  app.post('/upload', Upload.upload)
  app.post('/aupload', Upload.aupload)


}
var express = require('express')
var path = require('path')
var mongoose = require('mongoose')

var bodyParser = require("body-parser")
var cookieParser = require("cookie-parser")
var session = require("express-session")
var mongoStore = require('connect-mongo')(session)
var logger = require("morgan")
var serveStatic = require("serve-static")

//第三方账号登录---start
// var passport = require('passport')
//     , LocalStrategy = require('passport-local').Strategy
//     , GithubStrategy = require('passport-github').Strategy
//第三方账号登录---end



var port = process.env.PORT || 3000
var app = express()
var fs = require('fs')
var dbUrl = 'mongodb://localhost/imooc'

//图片上传
var busboy = require('connect-busboy');







mongoose.connect(dbUrl)

// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file
            var stat = fs.statSync(newPath)

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath)
                }
            } else if (stat.isDirectory()) {
                walk(newPath)
            }
        })
}
walk(models_path)
app.set('views', './app/views/pages')
app.set('view engine', 'jade')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))

// parse application/json
app.use(bodyParser.json())

app.use(cookieParser())
app.use(session({
    secret: 'imooc',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}))
app.use(busboy());
var env = process.env.NODE_ENV || "development"

if ('development' === env) {
    app.set('showStackError', true)
    app.use(logger(':method :url :status'))
    app.locals.pretty = true
        //mongoose.set('debug', true)
}
//第三方账号登录---start
// app.use(passport.initialize());
// app.use(passport.session());



// passport.use(new GithubStrategy({
//     clientID: "14d142cd6cbeff60dbe6",
//     clientSecret: "8abd7f5742f18431e5a65744a241e0004691c1ce",
//     callbackURL: "http://localhost:3000/auth/github/callback"
// },function(accessToken, refreshToken, profile, done) {
//     done(null, profile);
// }));


// passport.serializeUser(function (user, done) {//保存user对象
//     done(null, user);//可以通过数据库方式操作
// });

// passport.deserializeUser(function (user, done) {//删除user对象
//     done(null, user);//可以通过数据库方式操作
// });


//第三方账号登录---end







//加入上传图片的中间件

require('./config/routes')(app)

app.listen(port)
app.locals.moment = require('moment')

app.use(serveStatic(path.join(__dirname, 'public')))

console.log('imooc started on port ' + port)

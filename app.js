var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var serveStatic = require('serve-static');

//fs是node内置的
var fs = require('fs')

//图片上传
var busboy = require('connect-busboy');

//实例化 express
var app = express()

//第三方账号登录---start
// var passport = require('passport')
//     , LocalStrategy = require('passport-local').Strategy
//     , GithubStrategy = require('passport-github').Strategy
//第三方账号登录---end


//环境变量的PORT，因为你部署的环境可能会为你预置了端口
//如果部署环境已预置端口，则使用预置端口，否则使用3000端口
var port = process.env.PORT || 3000



//MongoDB数据库连接
var dbUrl = 'mongodb://localhost/imooc'
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

//设置视图响应目录，渲染的驱动
app.set('views', './app/views/pages')
app.set('view engine', 'jade')

// 下面两行是处理post请求的,处理并存入req.body
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

//*req.query：我用来接收GET方式提交参数
//*req.body：我用来接收POST提交的参数
//*req.params：两种都能接收到

//*req.body.name  (name是表单的name)




app.use(cookieParser())
app.use(session({

    //这是用于签署会话ID cookie的密码
    secret: 'imooc',

    //强制将会话保存回会话存储(store)，即使在请求期间会话未被修改
    //就是如果客户端向服务器请求打开两个网页,如果其中一个更改会影响另一个的功能
    resave: false,

    //强制将一个“未初始化”的会话保存到store
    saveUninitialized: true,
    // cookie: { secure: true },

    // 会话存储实例
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}))

//busboy这个包是用来当传输的数据是HTML表单标签字符串时解析
app.use(busboy());


var env = process.env.NODE_ENV || 'development';

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

//monent是一个用于解析，验证，操作和格式化日期的轻量级JavaScript日期库
app.locals.moment = require('moment')

//不能去掉，去掉获取不到public里的文件
app.use(serveStatic(path.join(__dirname, 'public')))

console.log('imooc started on port ' + port)

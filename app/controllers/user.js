var mongoose = require('mongoose')
var User = mongoose.model('User')

// signup
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: '注册页面'
  })
}

exports.showSignin = function(req, res) {
  res.render('signin', {
    title: '登录页面'
  })
}

exports.signup = function(req, res) {
  //req.body.user传来的是注册页面的user(其中包含user的一些属性)
  var _user = req.body.user

  User.findOne({name: _user.name},  function(err, user) {
    if (err) {
      console.log(err)
    }

    if (user) {
      return res.redirect('/')
    }
    else {
      //如果user是个不存在的用户,那么创建一个User(并且传入user提交来的信息)
      user = new User(_user)
      //保存user
      user.save(function(err, user) {
        if (err) {
          console.log(err)
        }

        res.redirect('/')
      })
    }
  })
}

// signin
exports.signin = function(req, res) {
  var _user = req.body.user
  var name = _user.name
  var password = _user.password

  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err)
    }

    if (!user) {
      return res.redirect('/signup')
    }
    //验证密码
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err)
      }

      if (isMatch) {
        req.session.user = user

        return res.redirect('/')
      }
      else {
        return res.redirect('/signin')
      }
    })
  })
}

// logout
exports.logout =  function(req, res) {
  delete req.session.user
  //delete app.locals.user
  
  res.redirect('/')
}

// userlist page
exports.list = function(req, res) {
  User.fetch(function(err, users) {
    if (err) {
      console.log(err)
    }

    res.render('userlist', {
      title: 'imooc 用户列表页',
      users: users
    })
  })
}

// midware for user
exports.signinRequired = function(req, res, next) {
  var user = req.session.user

  if (!user) {
    return res.redirect('/signin')
  }

  next()
}

exports.adminRequired = function(req, res, next) {
  var user = req.session.user

  if (user.role <= 10) {
    return res.redirect('/signin')
  }

  next()
}


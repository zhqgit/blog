var mongoose = require('mongoose')
var Article = mongoose.model('Article')
var Catetory = mongoose.model('Catetory')
var Comment = mongoose.model('Comment')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')

// detail page
exports.pagedetail = function(req, res) {

    //req.params,一个数组，包含命名过的路由参数
    var id = req.params.id

    //update 子句更新符合指定条件的文档
    Article.update({ _id: id }, { $inc: { pv: 1 } }, function(err) {
        if (err) {
            console.log(err)
        }
    })

    Article.findById(id, function(err, article) {
        Comment
            .find({ article: id })
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function(err, comments) {
                if (err) {
                    console.log(err)
                }
                res.render('pagedetail', {
                    title: 'imooc 详情页',
                    article: article,
                    comments: comments
                })
            })
    })
}

// admin new page
exports.new = function(req, res) {

    Catetory.find({}, function(err, catetories) {
        res.render('article', {
            title: '文章录入页',
            catetories: catetories,
            article: {}
        })
    })
}

// admin update page
exports.update = function(req, res) {
    var id = req.params.id

    if (id) {
        Article.findById(id, function(err, article) {
            Catetory.find({}, function(err, catetories) {
                res.render('admin', {
                    title: '文章更新页',
                    article: article,
                    catetories: catetories
                })
            })
        })
    }
}

// // admin poster
// exports.savePoster = function(req, res, next) {
//   var posterData = req.files.uploadPoster
//   var filePath = posterData.path
//   var originalFilename = posterData.originalFilename

//   if (originalFilename) {
//     fs.readFile(filePath, function(err, data) {
//       var timestamp = Date.now()
//       var type = posterData.type.split('/')[1]
//       var poster = timestamp + '.' + type
//       var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

//       fs.writeFile(newPath, data, function(err) {
//         req.poster = poster
//         next()
//       })
//     })
//   }
//   else {
//     next()
//   }
// }

// admin post movie
exports.save = function(req, res) {

    //req.body 对应的是解析过的请求体
    var id = req.body.article._id
    var articleObj = req.body.article
    var _article

    //req.poster是什么
    if (req.poster) {
        articleObj.poster = req.poster
    }

    //如果文章的id存在，则证明是修改
    if (id) {
        Article.findById(id, function(err, article) {
            if (err) {
                console.log(err)
            }


            //_.extend(destination, *sources) 
            //复制source对象中的所有属性覆盖到destination对象上，并且返回 destination 对象
            //复制是按顺序的, 所以后面的对象属性会把前面的对象属性覆盖掉(如果有重复).    

            _article = _.extend(article, articleObj)
            _article.save(function(err, article) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/article/' + article._id)
            })
        })
    }

    //文章id不存在,则新建
    else {
        _article = new Article(articleObj)

        var catetoryId = articleObj.catetory
        var catetoryName = articleObj.catetoryName
        var delTags = []
        //保存文章
        _article.save(function(err, article) {
            if (err) {
                console.log(err)
            }


            //文章的将要保存的集合存在,则将文章id保存进去
            if (catetoryId) {
                Catetory.findById(catetoryId, function(err, catetory) {
                    catetory.articles.push(article._id)

                    catetory.save(function(err, catetory) {
                        res.redirect('/article/' + article._id)
                    })
                })
            }

            //文章的将要保存的集合不存在,则新建
            else if (catetoryName) {
                var catetory = new Catetory({
                    name: catetoryName,
                    articles: [article._id]
                })

                //保存新建文章集合
                catetory.save(function(err, catetory) {
                    article.catetory = catetory._id
                    article.save(function(err, article) {
                        res.redirect('/article/' + article._id)
                    })
                })
            }
        })
    }
}

// list page
exports.list = function(req, res) {
    Article.find({})
        .populate('catetory', 'name')
        .exec(function(err, articles) {
            if (err) {
                console.log(err)
            }

            res.render('articleslist', {
                title: 'imooc 列表页',
                articles: articles
            })
        })
}




//获得总页数
exports.weblisttotal = function (req,res,next) {
    Catetory
        .findOne({ 'name': '前端' },function (err, items) {
            var totalPageNum,
                onePageNum = 10;
            totalPageNum = items.length;
            console.log(totalPageNum);
            next();
        })
}

//伪分页的实现方式

//list web-articles page
//populate是mongoose的方法
//解构artilces这个字段
//select挑选的字段
//限制返回artilces字段个数

var totalPageNum,
    onePageNum = 3;
exports.weblist = function(req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //得到总的页数
    Catetory
        .findOne({ 'name': '前端' },function (err, items) {
            totalPageNum = Math.ceil(items.articles.length / onePageNum);
            console.log(totalPageNum);
            console.log(items);
        })

    Catetory
        .findOne({ 'name': '前端' })
        .populate({
            path: 'articles',
            select: 'title pv content meta __v',

            //skip忽略
            options:{skip:2*(page-1),limit:onePageNum}
        })
        .exec(function(err, catetory) {
            // totalPageNum = Math.ceil(catetory.articles.length / onePageNum);
            if (err) {
                console.log(err)
            }
            res.render('weblist', {
                catetory: catetory,
                totalPageNum: totalPageNum,
                page: page
            })
        })
}



// // admin update page
// exports.update = function(req, res) {
//   var id = req.params.id

//   if (id) {
//     Article.findById(id, function(err, article) {
//       Catetory.find({}, function(err, catetories) {
//         res.render('admin', {
//           title: '文章更新页',
//           article: article,
//           catetories: catetories
//         })
//       })
//     })
//   }
// }



//list life-articles page
exports.lifelist = function(req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //得到总的页数
    Catetory
        .findOne({ 'name': '杂记' },function (err, items) {
            totalPageNum = Math.ceil(items.articles.length / onePageNum);
            console.log(totalPageNum);
            console.log(items);
        })

    Catetory
        .findOne({ 'name': '杂记' })
        .populate({
            path: 'articles',
            select: 'title pv content meta __v',

            //skip忽略
            options:{skip:2*(page-1),limit:onePageNum}
        })
        .exec(function(err, catetory) {
            // totalPageNum = Math.ceil(catetory.articles.length / onePageNum);
            if (err) {
                console.log(err)
            }
            res.render('weblist', {
                catetory: catetory,
                totalPageNum: totalPageNum,
                page: page
            })
        })
}

// list page
exports.del = function(req, res) {
    var id = req.query.id

    if (id) {
        Article.remove({ _id: id }, function(err, article) {
            if (err) {
                console.log(err)
                res.json({ success: 0 })
            } else {
                res.json({ success: 1 })
            }
        })
    }
}

exports.mydetail = function(req, res) {
  res.render('my', {
    title: 'zhqGit'
  })
}

exports.resume = function(req, res) {
    res.render('resume', {
        title: 'zhqGit'
    })
}
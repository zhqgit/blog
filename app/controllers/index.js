var mongoose = require('mongoose')
var Movie = mongoose.model('Movie')
var Category = mongoose.model('Category')

var Article = mongoose.model('Article');
var Catetory = mongoose.model('Catetory');



exports.atime = function(req, res,next) {
  Catetory
    .aggregate([{
      $unwind: '$articles'
    }, {
      $project: {
        year: {
          '$substr': ['$meta.updateAt', 0, 4]
        },
        month: {
          '$substr': ['$meta.updateAt', 5, 2]
        },
        _id:'$articles'
      }
    }, {
      $group: {
        '_id': {
          'year': '$year',
          'month': '$month'
        },
        'count': {
          '$sum': 1
        }
      }
    }])
    //(err,result)中的result是作为上面筛选出来的结果的结果集的名字
    //res.render中第一个result是作为传入jade中用到的
    //res.render中第二个result和(err,result)中的result一致
    .exec(function(err, result) {
      if (err) {
        console.log(err)
      }
      res.render('index', {
        result: result
      })

    })
}


exports.apv = function(req, res) {
  Article
    .aggregate([{
      $project: {
        pv: '$pv',
        title: '$title'
      }
    }, {
      $sort: {
        pv: -1
      }
    }, {
      $limit: 5
    }])
    //(err,result)中的result是作为上面筛选出来的结果的结果集的名字
    //res.render中第一个result是作为传入jade中用到的
    //res.render中第二个result和(err,result)中的result一致
    .exec(function(err, pvresult) {
      if (err) {
        console.log(err)
      }
      res.render('index', {
        pvresult: pvresult
      })

    })
}

// index page
exports.index = function(req, res) {
  // Category
  //   .find({})
  //   .populate({
  //     //category的movies
  //     path: 'movies',
  //     //得到movie的title和poster
  //     select: 'title poster',
  //     //限制返回个数
  //     options: { limit: 6 }
  //   })
  //   .exec(function(err, categories) {
  //     if (err) {
  //       console.log(err)
  //     }

  //     res.render('index', {
  //       title: 'imooc 首页',
  //       categories: categories
  //     })
  //   })
  Catetory
    .find({})
    .populate({
      path: 'articles',
      select: 'title content',
      options: {
        limit: 5
      }
    })
    .exec(function(err, catetories) {
      if (err) {
        console.log(err)
      }
      res.render('index', {
        // result:result,
        catetories: catetories
      })
    })

  // Catetory
  //   .aggregate([{
  //     $unwind: '$articles'
  //   }, {
  //     $project: {
  //       year: {
  //         '$substr': ['$meta.updateAt', 0, 4]
  //       },
  //       month: {
  //         '$substr': ['$meta.updateAt', 5, 2]
  //       }
  //     }
  //   }, {
  //     $group: {
  //       '_id': {
  //         'year': '$year',
  //         'month': '$month'
  //       },
  //       'count': {
  //         '$sum': 1
  //       }
  //     }
  //   }])
  //   //(err,result)中的result是作为上面筛选出来的结果的结果集的名字
  //   //res.render中第一个result是作为传入jade中用到的
  //   //res.render中第二个result和(err,result)中的result一致
  //   .exec(function(err, result) {
  //     if (err) {
  //       console.log(err)
  //     }
  //     res.render('index', {
  //       result: result
  //     })
  // })
}

// search page
exports.search =
  function(req, res) {
    var catId = req.query.cat
    var q = req.query.q
    var page = parseInt(req.query.p, 10) || 0
    var count = 2
    var index = page * count

    if (catId) {
      Category
        .find({
          _id: catId
        })
        .populate({
          path: 'movies',
          select: 'title poster'
        })
        .exec(function(err, categories) {
          if (err) {
            console.log(err)
          }
          var category = categories[0] || {}
          var movies = category.movies || []
          var results = movies.slice(index, index + count)

          res.render('results', {
            title: 'imooc 结果列表页面',
            keyword: category.name,
            currentPage: (page + 1),
            query: 'cat=' + catId,
            totalPage: Math.ceil(movies.length / count),
            movies: results
          })
        })
    } else {
      Movie
        .find({
          title: new RegExp(q + '.*', 'i')
        })
        .exec(function(err, movies) {
          if (err) {
            console.log(err)
          }
          var results = movies.slice(index, index + count)

          res.render('results', {
            title: 'imooc 结果列表页面',
            keyword: q,
            currentPage: (page + 1),
            query: 'q=' + q,
            totalPage: Math.ceil(movies.length / count),
            movies: results
          })
        })
    }
  }
var mongoose = require('mongoose')
var Collection = mongoose.model('Collection')

// admin new page
exports.new = function(req, res) {
  res.render('collection_admin', {
    title: 'imooc 后台分类录入页',
    collection: {}
  })
}

// catelist page
exports.list = function(req, res) {
  Collection.fetch(function(err, collections) {
    if (err) {
      console.log(err)
    }

    res.render('collectionlist', {
      title: 'imooc 分类列表页',
      collections: collections
    })
  })
}
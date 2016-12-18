var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var ArticleSchema = new mongoose.Schema({
  author: String,
  title: String,
  summary: String,
  content: String,
  img:String,
  pv: {
    type: Number,
    default: 0
  },
  catetory: {
    type: ObjectId,
    ref: 'Catetory'
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

//中间件是一种控制函数，类似插件，能控制流程中的init、validate、save、remove方法
//中间件的分类：
//1、Serial串行
//串行使用pre方法，执行下一个方法使用next调用
//2、Parallel并行
//并行提供更细粒度的操作

// this 应该是指ArticleSchema
ArticleSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

//statics中设置model可以使用的函数
ArticleSchema.statics = {
  fetch: function(cb) {
    return this
      //找到集合中所有文档
      .find({})
      //按照时间排序
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({
        _id: id
      })
      .exec(cb)
  },
  // artfetch:function(cb){
  //   return this
  //   .find({})
  //   .aggregate(
  //     [{
  //       $group: {
  //         _id: {
  //           month: {
  //             $month: "$date"
  //           },
  //           year: {
  //             $year: "$date"
  //           }
  //         },
  //         // 按月年分组
  //         count: {
  //           $sum: 1
  //         }
  //       },

  //     }, {
  //       $sort: {
  //         _id: 1
  //       }
  //     }, {
  //       $out: 'result'
  //     }]
  //   )
  //   .exec(cb)
  // }
}

module.exports = ArticleSchema
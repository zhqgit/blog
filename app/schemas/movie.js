var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ObjectId = Schema.Types.ObjectId
//关于Schema.Types:(简单点说应该就是数据模式的类型)
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// Objectid
// Array


//ObjectId
//主键，一种特殊而且非常重要的类型，每个Schema都会默认配置这个属性，属性名为_id，除非自己定义，方可覆盖

var MovieSchema = new Schema({
  doctor: String,
  title: String,
  language: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  pv: {
    type: Number,
    default: 0
  },
  category: {
    type: ObjectId,
    ref: 'Category'
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


MovieSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  next()
})

MovieSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = MovieSchema
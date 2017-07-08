var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

//文章集合需要保存的数据
var CatetorySchema = new Schema({
  name: String,
  articles: [{type: ObjectId, ref: 'Article'}],

  meta: {
    //创建的时间
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
    //更新的时间
      type: Date,
      default: Date.now()
    }
  }
})

// var ObjectId = mongoose.Schema.Types.ObjectId
CatetorySchema.pre('save', function(next) {
  //判断文章集合是否是新建
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

CatetorySchema.statics = {
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

module.exports = CatetorySchema
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

//文章集合需要保存的数据

//先找到集合 后找到文章的集合名
var CollectionSchema = new Schema({
  name: String,
  catetory: [{type: ObjectId, ref: 'Catetory'}]
})

CollectionSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = CollectionSchema
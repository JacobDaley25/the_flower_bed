const mongoose = require('mongoose');

const leafSchema = new mongoose.Schema({
  title:{type:String, required:true},
  blog:{type:String, required:true},
  replies:[{reply:String}]
},{ timestamps: true })

const Leaf = mongoose.model('leaves',leafSchema)

module.exports = Leaf;

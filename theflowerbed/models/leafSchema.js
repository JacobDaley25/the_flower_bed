const mongoose = require('mongoose');

const leafSchema = new mongoose.Schema({
  userId: {
    type:String, required:true
  },
  title:{type:String, required:true},
  blog:{type:String, max:350},
  img:{type:String},
  replies:{type:Array, default:[]},
  user: {type: mongoose.Schema.ObjectId, ref: 'username'},
},{ timestamps: true })

const Leaf = mongoose.model('leaves',leafSchema)

module.exports = Leaf;

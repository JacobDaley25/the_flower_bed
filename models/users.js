const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
  username:{type:String, unique: true, required: true},
  password:{type:String, unique:true, required: true},
  proilePicture:{type:String},
  followers:[String],
  following:[String],
  email:String
})

const User = mongoose.model('users', userSchema)

module.exports = User;

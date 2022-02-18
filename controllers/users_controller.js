
const bcrypt = require('../server.js').bcrypt
const express = require('express')
const users = express.Router()
const User = require('../models/users.js')
const UserSeed = require('../models/user-seed.js')



users.post('/', (req,res) => {
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (error, createdUser)=>{
    if (error){
      console.log('error');
    }else {
    console.log('user is created', createdUser);
    res.redirect('/sessions/new')
    }
  })
})




users.get('/new',(req, res) => {
  res.render('users-new.ejs',{

  currentUser: req.session.currentUser,

  })
})

// User.create(UserSeed,(error, data) => {
//   if (error) {
//     console.log('err');
//   }else{
//     console.log('user added!');
//   }
// })



module.exports = users

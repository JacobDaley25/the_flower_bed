const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const User = require('../models/users.js')

sessions.get('/new', (req,res) => {
  res.render('sessions-new.ejs',
  {
    currentUser:req.body.username
  }
);
console.log(req.body.username);
})
//on seesions form submit (log in)
sessions.post('/', (req, res) => {

  User.findOne({username:req.body.username}, (error, foundUser) => {

    if (error){
      console.log('error');
      res.send('oops we had a problem')
    }if (!foundUser) {
      res.send('<a href="/users/new">Sorry, no user found </a>')
    }else{
      //user is found
      //check if passwords match
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        //add user to session
      req.session.currentUser = foundUser
      // redirect to home page
      res.redirect('/theflowerbed')
    } else{
      //passwords do not match
      res.send('<a href="/">password does not match </a>')
    }
    }
  })
// })
})
// sessions.delete('/', (req, res)=>{
//   req.session.destroy(() =>{
//     res.redirect('/')
//   })
// })


module.exports = sessions

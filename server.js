
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const methodOverride = require('method-override')
const dotenv = require('dotenv')
require('dotenv').config()



const userController = require('./controllers/users_controller.js')
const sessionController = require('./controllers/sessions_controller.js')
const postController = require('./controllers/post-controller.js')

const session = require('express-session')
const bcrypt = require('bcrypt')
const saltRounds = 10
const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/sessions/new')
  }
}
const bodyParser = require('body-parser')
const Leaf = require('./models/leafSchema.js')
const LeafSeed = require('./models/seed.js')
const User = require('./models/users.js')
const db = mongoose.connection;



const PORT = process.env.PORT || 3000;

const mongoURI = String(process.env.MONGODBURI);

mongoose.connect(mongoURI);

//MIDDLEWARE

app.use(
  session({
    secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: true// default  more info: https://www.npmjs.com/package/express-session#resave
  })
)
app.use(bodyParser.json()).use(bodyParser.urlencoded({extended:true}))
app.use('/sessions', sessionController)
app.set('view engine', 'ejs');
app.use('/users', userController)
app.use('/posts', postController)
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(isAuthenticated)
// Leaf.create(LeafSeed, (error, data) => {
//   if (error) {
//     console.log('err');
//   }else {
//     console.log('leaf added!');
//   }
// })



//ROUTES
app.get('/TheFlowerBed/MyProfile/:_id', isAuthenticated, (req, res) => {
  User.findById(req.params._id,req.body,(error, foundProfile)=>{
    res.render('profile-show.ejs',
    {
      currentUser: req.session.currentUser,
      foundProfile: req.session.currentUser,
      user: req.session.currentUser
    }
  )
  })
})
app.get('/TheFlowerBed/MyProfile/:_id/myLeaves', isAuthenticated, (req,res) => {
  if (Leaf.userId === req.session.user_Id){
    Leaf.find({id:req.params.userId}, (error,yourLeaves)=>{
      res.render('myleaves.ejs',
      {
        yourLeaves: yourLeaves
      }
    );
    })
  }else{
    console.log('havent coded yet');
  }
})
// app.put('/TheFlowerBed/:_id', isAuthenticated, (req, res) => {
//   Leaf.findByIdAndUpdate(req.params._id,req.body,{new:true}, (error, updatedModel) => {
//     res.redirect('/TheFlowerBed')
//   })
// })

app.delete('/TheFlowerBed/:_id', isAuthenticated, (req, res) => {
  if(Leaf.userId === req.body.userId){
    Leaf.findByIdAndRemove(req.params._id, req.body, (error, updatedModel) => {
      res.redirect('/TheFlowerBed')
    })


    console.log('the post has been deleted');
  }else{
    console.log('You can only delete your posts');
  }
})

app.get('/TheFlowerBed/:_id/edit', (req,res) => {
  Leaf.findById(req.params._id, (error,selectedLeaf) => {

    res.render(
      'edit.ejs',
      {
        data: selectedLeaf,
        currentUser: req.session.currentUser,
        user: req.session.currentUser
      }
    );
  })
})

// app.get('/TheFlowerBed/new', (req, res) => {
//   res.render('new.ejs',
//   {
//     user:req.session.currentUser
//   }
// );
// })

app.get('/TheFlowerBed/:_id', (req,res) => {
  Leaf.findById(req.params._id, (error,foundLeaf) => {
    res.render(
      'show.ejs',
      {
        leaf:foundLeaf,
        currentUser: req.session.currentUser,
        user: req.session.currentUser
      }
    )
  })
})


app.get('/TheFlowerBed', (req,res) => {
Leaf.find({}, (error, allLeaves) => {

  res.render('index.ejs',
  {
    data:allLeaves,
    user: req.session.currentUser
  }
);
})
})
// app.post('/TheFlowerBed', (req,res)=> {
//   Leaf.create(req.body, (error,createdLeaf) => {
//     if (error) {
//       console.log('err');
//     }else {
//     res.redirect('/TheFlowerBed')
//   }
//   })
// })


//follow a user
app.put('/:_id/follow', async (req,res)=>{
  if(req.body.userId === req.params.id){
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.UserId)
      if(!user.followers.includes(req.body.userId)){
        await user.updateOne({$push:{follower:req.body.userId}})
        await user.updateOne({$push:{followings:req.body.userId}})
        res.send('user has been followed')
      }else{
        res.send('you already follow this user')
      }
    }catch(error){
      res.send(error)
    }
  }else{
    res.send('you cant follow yourself')
  }
})




app.listen(PORT, () => {
  console.log('listening...');
})

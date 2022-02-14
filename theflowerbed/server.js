const mongoose = require('mongoose');
const express = require('express');
const app = express();
const methodOverride = require('method-override')
const userController = require('./controllers/users_controller.js')
const sessionController = require('./controllers/sessions_controller.js')
const dotenv = require('dotenv').config()
const session = require('express-session')
const bcrypt = require('bcrypt')
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
const db = mongoose.connection



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
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(isAuthenticated)
// Leaf.create(LeafSeed, (error, data) => {
//   if (error) {
//     console.log('err');
//   }else {
//     console.log('leaf added!');
//   }
// })






app.put('/TheFlowerBed/:_id', (req, res) => {
  Leaf.findByIdAndUpdate(req.params._id,req.body,{new:true}, (error, updatedModel) => {
    res.redirect('/TheFlowerBed')
  })
})

app.delete('/TheFlowerBed/:_id', (req, res) => {
  Leaf.findByIdAndRemove(req.params._id, req.body, (error, updatedModel) => {
    res.redirect('/TheFlowerBed')
  })
})

app.get('/TheFlowerBed/:_id/edit', (req,res) => {
  Leaf.findById(req.params._id, (error,selectedLeaf) => {

    res.render(
      'edit.ejs',
      {
        data: selectedLeaf
      }
    );
  })
})

app.get('/TheFlowerBed/new', (req, res) => {
  res.render('new.ejs')
})

app.get('/TheFlowerBed/:_id', (req,res) => {
  Leaf.findById(req.params._id, (error,foundLeaf) => {
    res.render(
      'show.ejs',
      {
        leaf:foundLeaf
      }
    )
  })
})


app.get('/TheFlowerBed', (req,res) => {
Leaf.find({}, (error, allLeaves) => {

  res.render('index.ejs',
  {
    data:allLeaves,
  }
);
})
})
app.post('/TheFlowerBed', (req,res)=> {
  Leaf.create(req.body, (error,createdLeaf) => {
    if (error) {
      console.log('err');
    }else {
    res.redirect('/TheFlowerBed')
  }
  })
})




// app.get('/any', (req, res) => {
//   //any route will work
//   req.session.anyProperty = 'test'
// })
//
// app.get('/retrieve', (req, res) => {
//   //any route will work
//   if (req.session.anyProperty === 'test') {
//     //test to see if that value exists
//     //do something if it's a match
//     console.log('it matches! cool')
//   } else {
//     //do something else if it's not
//     console.log('nope, not a match')
//   }
//   res.redirect('/')
// })
//
//
// app.get('/update', (req, res) => {
//   //any route will work
//   req.session.anyProperty = 'changing anyProperty to this value'
//   res.redirect('/')
// })
//
// app.get('/destroy-route', () => {
//   //any route will work
//   req.session.destroy(err => {
//     if (err) {
//       //do something if destroying the session fails
//     } else {
//       //do something if destroying the session succeeds
//     }
//   })
//   res.redirect('/')
// })



mongoose.connect('mongodb://localhost:27017/TheFlowerBed'), () => {
  console.log('The connection with mongod is established');
}

app.listen(3000, () => {
  console.log('listening...');
})

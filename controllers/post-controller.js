const express = require('express')
const posts = express.Router()
const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/sessions/new')
  }
}

const Leaf = require('../models/leafSchema.js')
const User = require('../models/users.js')


posts.get('/TheFlowerBed/MyProfile/:_id', isAuthenticated, (req, res) => {
  User.findById(req.params._id,req.body,(error, foundProfile)=>{
    res.render('profile-show.ejs',
    {
      profile: foundProfile
    }
  )
  })
})
posts.get('/TheFlowerBed/new', (req, res) => {
  res.render('new.ejs',
  {
    user:req.session.currentUser
  }
);
})

//create a post
posts.post('/TheFlowerBed', async(req,res)=>{
  const newPost = new Leaf(req.body)
  try{
    const savedPost = await newPost.save()
    console.log(savedPost);
    res.redirect('/TheFlowerBed/MyProfile/:_id')
  } catch (error){
    console.log('error');
  }
})
//update a post
posts.put('/:_id',async(req,res)=>{
  try{
  const post = Leaf.findById(req.params._id);
  if(leaf.userId === req.body.userId){
    await post.updateOne({$set:req.body})
    (req.params._id, (error,selectedLeaf) => {
    console.log('the post has been updated');
  })
}else{
    console.log('You can only edit your posts');
  }
}catch(error){
  console.log('error');
}
})
//delete a post
posts.delete('/:_id',async(req,res)=>{
  try{
  const post = Leaf.findById(req.params._id);
  if(leaf.userId === req.body.userId){
    await post.deleteOne(post)

    console.log('the post has been deleted');
  }else{
    console.log('You can only delete your posts');
  }

}catch(error){
  console.log('error');
}
})

//like a post
posts.put('/:_id/like', async(res,req)=>{
  try{
  const post = await Leaf.findById(req.params._id)
  if(!post.likes.includes(req.body.userId)) {
    console.log('post has been liked');
  }else{
    await post.updateOne({$pull:{likes:req.body.userId}})
  }
}catch(error){
  console.log('error');
}
});
//get a post
posts.get('/:_id', async(req,res)=>{
  try{
    const post = Leaf.findById(req.params._id)
      post, (error,foundLeaf) => {
        res.render(
          'show.ejs',
          {leaf:foundLeaf,currentUser: req.session.currentUser
          }
      )
}
}catch(error){
    console.log('error');
  }

})
//get timeline posts
posts.get('/timeline/all', async(req,res)=>{
  try{
    const currentUser = await User.findById(req.body.userId)
    const userPosts = await Lead.find({userId: currentUser._id})
    const friendPosts = await Promie.all(
      currentUser.follings.map(friendId=>{
        Leaf.find({userId:friendId})
      })
    )
  }catch(error){
    console.log('error');
  }
})
module.exports = posts

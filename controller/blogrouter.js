const express = require("express")
const blogrouter = express.Router()
const Blog = require("../models/blog")

//don't miss await, exec() etc.
blogrouter.post('/add-blog', async (req, res)=>{
    console.log(req.body);
    let existblogDetail = await Blog.find({title: req.body.title}).collation({locale:"en", strength:2}).exec();  
    //existblogDetail[0].title = 'test4title'
    if (existblogDetail.length == 0) {
        const blogDetail = new Blog();
        blogDetail.title = req.body.title; 
        blogDetail.snippet = req.body.snippet;
        blogDetail.body =  req.body.body; 
        let data = await blogDetail.save();
        console.log(data);
        res.send(data);
    }
    else 
    {
        res.status(400).send("Same blog exist alreay");
    }
})

//this logic is not as good as update-blog, so I didn't put on the swagger
blogrouter.put('/change-blog', async (req, res)=>{
    console.log(req.body);
    let blogDetail = await Blog.find({title: req.body.title}).collation({locale:"en", strength:2}).exec();   
    if (blogDetail.length == 1){
        blogDetail[0].snippet = req.body.snippet;
        blogDetail[0].body =  req.body.body; 
        let data = await blogDetail[0].save();
        console.log(data);
        res.status(200).send(data);
    }
    else 
    {
        res.status(400).send("wrong input");
    }
})
//if miss [0] error like : blogDetail.save is not a function 
blogrouter.put('/update-blog/:strTitle', async (req, res)=>{
    console.log(req.body);
    console.log(req.params.strTitle);
    let blogDetail = await Blog.find({title: req.params.strTitle}).collation({locale:"en", strength:2}).exec();   
    if (blogDetail.length == 1){
        blogDetail[0].title = req.body.title;
        blogDetail[0].snippet = req.body.snippet;
        blogDetail[0].body =  req.body.body; 
        let data = await blogDetail[0].save();
        console.log(data);
        res.send(data);
    }
    else 
    {
        res.send("wrong input");
    }
})

//http://localhost:3000/api/blog/all-blogs
blogrouter.get('/all-blogs', (req, res)=>{
    Blog.find().sort({createdAt: -1})
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>console.log(err));
})


blogrouter.get('/blog/:strTitle', (req, res)=>{
    searchTitle = req.params.strTitle //"test4title"
    Blog.find({title: searchTitle}) //Blog.findById(auto_generated_db_id_string)
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>console.log(err));
})

//use of query, call like /blog?strTitle=test4title
blogrouter.delete('/blog', async (req, res)=>{ 
    searchTitle = req.query.strTitle; //"test4title"
    let blogDetail = await Blog.find({title: searchTitle}).collation({locale:"en", strength:2}).exec();   
    if (blogDetail.length == 1){
        let data = await blogDetail[0].deleteOne().exec();//deleteOne();
        console.log(data)        
        res.status(200).send("deleted "+ data.deletedCount +" blog(s)");
    }
    else{
        res.status(400).send("failure")
    }
})

//Auth.Auth_User still can working without router
const Auth = require('../middleware/auth');
blogrouter.delete('/deleteblog',Auth.Auth_User, async (req, res)=>{ 
    searchTitle = req.query.strTitle; //"test4title"
    let blogDetail = await Blog.find({title: searchTitle}).collation({locale:"en", strength:2}).exec();   
    if (blogDetail.length == 1){
        let data = await blogDetail[0].deleteOne().exec();//deleteOne();
        console.log(data)        
        res.status(200).send("deleted "+ data.deletedCount +" blog(s)");
    }
    else{
        res.status(400).send("failure")
    }
})

module.exports  = blogrouter
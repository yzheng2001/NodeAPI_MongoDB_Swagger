require('dotenv').config()
const express = require("express")
const app = express();

// const swagger = require("swagger-ui-express")
// const swaggerDoc = require("swagger-jsdoc")

const mongoose = require("mongoose")
//const dbURI ='mongodb+srv://zhengchristinayu:mongodbdemo@demo.xwnbpss.mongodb.net/?retryWrites=true&w=majority&appName=Demo'
//browser log in using my job google account

const dbURI = process.env.MongoDBURL
console.log("1" + dbURI);
// const username = "zhengchristinayu"
// const pwd =" mongodbdemo"   
const Blog = require("./models/blog")

// //if dbconstants just export one, like module.exports = DBUrl,  then 
// //const DBUrl = require('./dbconstants')
// const {DBUrl }= require('./dbconstants')
// console.log("check this out " + DBUrl )

bodyParser = require('body-parser')
app.use(bodyParser.json())

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
 // combines the 2 above, then you can parse incoming Request Object if object, with nested objects, or generally any type.
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerUi = require("swagger-ui-express");
//let env = process.env["Environment"];
const swaggerDocument = require("./swager.json");
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//app.listen(3000, ()=> console.log("server is up"));
mongoose.connect(dbURI)//, {useNewUrlParser: true, useUnifiedTopology: true});
    .then(()=> {
        console.log("connected to db");
        app.listen(3000, ()=> console.log("server is up"));
    })
    .catch(()=> console.log("cannot connect to db"))

// app.post('/add-blog-test', (req, res)=>{
//     console.log(req.body);
//     const myblog = new Blog({
//         snippet :'haha4',
//         title : 'test4title',
//         body :'test4 body'
//     })
//     const inputblog = req.body;
//     inputblog.save()
//     .then((data)=>{
//         res.send(data)
//     })
//     .catch((err)=>console.log(err));
// })

//router are like mini app, to seperate endpoints into different groups https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
const extra = require('./router')
app.use('/more', extra)
//you can test GET localhost:3000/more/getablog

//is miss await, exec() etc.
app.post('/add-blog', async (req, res)=>{
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
app.put('/change-blog', async (req, res)=>{
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
app.put('/update-blog/:strTitle', async (req, res)=>{
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

app.get('/all-blogs', (req, res)=>{
    Blog.find().sort({createdAt: -1})
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>console.log(err));
})


app.get('/blog/:strTitle', (req, res)=>{
    searchTitle = req.params.strTitle //"test4title"
    Blog.find({title: searchTitle}) //Blog.findById(auto_generated_db_id_string)
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>console.log(err));
})

//use of query, call like /blog?strTitle=test4title
app.delete('/blog', async (req, res)=>{ 
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
const Auth = require('./middleware/auth');
app.delete('/deleteblog',Auth.Auth_User, async (req, res)=>{ 
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

app.get("/", (req, res)=>{
    res.redirect('/all-blog');
})
//query string
//authorization
//other queries, filter, regex
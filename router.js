require('dotenv').config()
const express = require("express")
//const app = express();

const mongoose = require("mongoose")
//const dbURI ='mongodb+srv://zhengchristinayu:mongodbdemo@demo.xwnbpss.mongodb.net/?retryWrites=true&w=majority&appName=Demo'
//browser log in using my job google account

const dbURI = process.env.MongoDBURL
console.log(dbURI);
// const username = "zhengchristinayu"
// const pwd =" mongodbdemo"   
const Blog = require("./models/blog")

// //if dbconstants just export one, like module.exports = DBUrl,  then 
// //const DBUrl = require('./dbconstants')
// const {DBUrl }= require('./dbconstants')
// console.log("check this out " + DBUrl )

//bodyParser = require('body-parser')
//app.use(bodyParser.json())

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
 // combines the 2 above, then you can parse incoming Request Object if object, with nested objects, or generally any type.
//app.use(bodyParser.urlencoded({ extended: true }));


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
const Auth = require('./middleware/auth');
router = express.Router();
blogrouter = require('./controller/blogrouter')
userrouter = require('./controller/userrouter')

//here still need the staring /, although app.js already has a / in app.use('/', router)
router.use('/api/blog', blogrouter);
router.use('/api/user', userrouter);

router.get('/getablog', Auth.Auth_User, async (req, res)=>{ 
    console.log(req.body);
    res.send("got it");
})

//use of query, call like localhost:3000/more/blog?strTitle=test4title
router.delete('/blog',  Auth.Auth_User, async (req, res)=>{ 
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


module.exports = router
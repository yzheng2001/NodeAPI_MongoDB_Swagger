require('dotenv').config()
const express = require("express")
const app = express();

// const swagger = require("swagger-ui-express")
// const swaggerDoc = require("swagger-jsdoc")

const mongoose = require("mongoose")
//const dbURI ='mongodb+srv://zhengchristinayu:mongodbdemo@demo.xwnbpss.mongodb.net/?retryWrites=true&w=majority&appName=Demo'
//browser log in using my job google account

const dbURI = process.env.MongoDBURL
console.log(dbURI);
// const username = "zhengchristinayu"
// const pwd =" mongodbdemo"   
const Blog = require("./models/blog")

//if dbconstants just export one, like module.exports = DBUrl,  then 
//const DBUrl = require('./dbconstants')
const {DBUrl }= require('./dbconstants')
console.log("check this out " + DBUrl )

bodyParser = require('body-parser')
app.use(bodyParser.json())

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
 // combines the 2 above, then you can parse incoming Request Object if object, with nested objects, or generally any type.
app.use(bodyParser.urlencoded({ extended: true }));

//didn't configure swagger for the app.js, server.js has the working swagger

//router are like mini app, to seperate endpoints into different groups https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
const router = require('./router')
app.use('/', router)

//app.listen(3000, ()=> console.log("server is up"));
mongoose.connect(dbURI)//, {useNewUrlParser: true, useUnifiedTopology: true});
    .then(()=> {
        console.log("connected to db");
        app.listen(3000, ()=> console.log("server is up"));
    })
    .catch(()=> console.log("cannot connect to db"))

    
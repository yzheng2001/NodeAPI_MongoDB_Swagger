const mongoose = require("mongoose")
const Schema = mongoose.Schema

const BlogSchema = new Schema({
    title: {type: String, required:true},
    snippet: {type: String, required:true},
    body: {type: String, required:true}
}, {timestamps: true});

//model Blog which node code will use to connect to db = mongoose.model(the name to be plurarize before map in the collection name in db, schema to use)
const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
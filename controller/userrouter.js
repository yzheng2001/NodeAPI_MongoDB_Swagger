const express = require("express")
const userrouter = express.Router()




userrouter.get('/test', async (req, res)=>{ 
    console.log(req.body);
    res.send("got it");
})

module.exports  = userrouter
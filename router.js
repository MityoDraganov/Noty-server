

const express = require('express');
const Router = express.Router();

//CONTROLERS
const userControler = require("./api/controlers/userControler")
const notesControler = require('./api/controlers/notesControler');


//MIDDLEWEARS
const authMiddlewear = require("./middlewears/authMiddlewear");


Router.get("/", (req, res) =>{
    res.send("REST service operational...")
})


Router.post("/users/register", userControler.userCreationPost)
Router.post("/users/login", userControler.userLogin)
Router.get("/users/profile", authMiddlewear.tokenVerifier, userControler.getUserInfo)



Router.post("/notes/create", authMiddlewear.tokenAtacher, notesControler.noteCreate)


module.exports = Router;
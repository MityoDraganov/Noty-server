

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

//users
Router.post("/users/register", userControler.userCreationPost)
Router.post("/users/login", userControler.userLogin)
Router.get("/users/profile", authMiddlewear.tokenVerifier, userControler.getUserInfo)

//notes
Router.get("/notes", notesControler.getNotes)
Router.post("/notes/create", authMiddlewear.tokenAtacher, notesControler.createNote)
Router.post("/notes/edit/:id", notesControler.editNote)
Router.delete("/notes/:id", notesControler.deleteNote)


module.exports = Router;


const express = require('express');
const Router = express.Router();

//CONTROLERS
const userControler = require("./api/controlers/userControler")
const notesControler = require('./api/controlers/notesControler');
const noteGroupsControler = require("./api/controlers/noteGroupsControler")

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
Router.post("/notes/create/:noteGroupId", authMiddlewear.tokenAtacher, notesControler.createNote)
Router.post("/notes/edit/:id", notesControler.editNote)
Router.delete("/notes/:id", notesControler.deleteNote)

//note groups
Router.get("/noteGroups", authMiddlewear.tokenAtacher, noteGroupsControler.getGroups)
Router.post("/noteGroups/create/:noteGroupId", authMiddlewear.tokenAtacher, noteGroupsControler.createGroup)


module.exports = Router;
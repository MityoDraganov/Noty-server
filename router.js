

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
//Router.get("/users/profile", authMiddlewear.tokenVerifier, userControler.getUserInfo)

//notes
Router.get("/notes/:noteGroupId", authMiddlewear.tokenVerifier, notesControler.getNotes)
Router.post("/notes/create/:noteGroupId", authMiddlewear.tokenVerifier, notesControler.createNote)
Router.post("/notes/edit/:id", authMiddlewear.tokenVerifier, notesControler.editNote)
Router.delete("/notes/:id", authMiddlewear.tokenVerifier, notesControler.deleteNote)

//note groups
Router.get("/noteGroups", authMiddlewear.tokenVerifier, noteGroupsControler.getGroups)
Router.post("/noteGroups/create", authMiddlewear.tokenVerifier, noteGroupsControler.createGroup)
Router.post("/noteGroups/edit/:noteGroupId", authMiddlewear.tokenVerifier, noteGroupsControler.editGroup)

Router.post("/noteGroups/addUser/:noteGroupId", authMiddlewear.tokenVerifier, noteGroupsControler.addUserToGroup)
Router.post("/noteGroups/deleteUser/:noteGroupId", authMiddlewear.tokenVerifier, noteGroupsControler.deleteUserFromGroup)


module.exports = Router;
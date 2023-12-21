const noteGroupModel = require("../models/noteGroup")

const userModel = require("../models/user")

//SERVICES
const { findUserById } = require("../services/userServices");




async function getGroups(req, res) {
    try {
        const userCredentials = req.userTokenCredentials;

        // get the groups that are visible to the user
        const notes = await noteGroupModel.find({
            permitedUsers: userCredentials._id
        });

        res.send(JSON.stringify(notes));
    } catch (err) {
        res.status(400).send(err.message);
    }
}

async function createGroup(req, res) {
	try {
		const userCredentials = req.userTokenCredentials

		const data = req.body;
		const { title, description } = data


		const noteGroup = await noteGroupModel.create({
			title,
			description,
			owner: userCredentials._id
		});
		noteGroup.permitedUsers.push(userCredentials._id)
		await noteGroup.save()


		const notes = await noteGroupModel.find({
            permitedUsers: userCredentials._id
        });


		res.send(
			JSON.stringify(notes)
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}

async function addUserToGroup(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials
		const groupId = req.params.id
		const { userEmail } = req.body

		const noteGroup = await noteGroupModel.findById(groupId)

		if(noteGroup.owner !== userTokenCredentials._id){
			throw new Error("Action not authorized - you are not the owner of the group!")
		}

		const user = await userModel.findOne({
			email: userEmail
		})

		if(!user){
			throw new Error("User not found!")
		}

		noteGroup.permitedUsers.push(user._id)
		await noteGroup.save()

		res.send(
			JSON.stringify(noteGroup)
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}

async function deleteUserFromGroup(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials

		const noteId = req.params.id


		const noteGroup = await noteGroupModel.findByIdAndDelete(noteId)


		const notes = await noteGroupModel.find()


		res.send(
			JSON.stringify(notes)
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}


module.exports = { createGroup, addUserToGroup, deleteUserFromGroup, getGroups };

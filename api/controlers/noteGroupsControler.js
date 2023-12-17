const noteGroupModel = require("../models/noteGroup")

const userModel = require("../models/user")

//SERVICES
const { findUserById } = require("../services/userServices");




async function getGroups(req, res) {

	try {
		const notes = await noteGroupModel.find()



		res.send(
			JSON.stringify(notes)
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}

async function createGroup(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials

		const data = req.body;
		const { title, description } = data


		const note = await noteGroupModel.create({
			title,
			description
		});

		if (userTokenCredentials) {
			const user = findUserById(userTokenCredentials._id)
			user.notes.push(note._id)
			await user.save()
		}

		const notes = await noteGroupModel.find()


		res.send(
			JSON.stringify(notes)
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}

async function addNoteToGroup(req, res) {
	try {
		//const userTokenCredentials = req.userTokenCredentials

		const groupId = req.params.id

		const data = req.body;
		const { title, description } = data


		const note = await noteGroupModel.findById(noteId)

		note.title = title;
		note.description = description;
		await note.save()

		// if (userTokenCredentials) {
		// 	const user = await userModel.findById(userTokenCredentials._id)
		// 	user.notes.push(note._id)
		// 	await user.save()
		// }

		const notes = await noteGroupModel.find()



		res.send(
			JSON.stringify(notes)
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}

async function deleteNoteFromGroup(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials

		const noteId = req.params.id


		const note = await noteGroupModel.findByIdAndDelete(noteId)

		if (userTokenCredentials) {
			const user = await userModel.findById(userTokenCredentials._id)
			

			//verify user here
		}

		const notes = await noteGroupModel.find()


		res.send(
			JSON.stringify(notes)
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}


module.exports = { createGroup, addNoteToGroup, deleteNoteFromGroup, getGroups };

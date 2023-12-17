const noteModel = require("../models/note")

const userModel = require("../models/user")

//SERVICES
const { findUserById } = require("../services/userServices");
const { findNoteById } = require("../services/noteServices");



async function getNotes(req, res) {

	try {
		const notes = await noteModel.find()



		res.send(
			JSON.stringify(notes)
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}

async function createNote(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials

		const data = req.body;
		const { title, description } = data


		const note = await noteModel.create({
			title,
			description
		});

		if (userTokenCredentials) {
			const user = findUserById(userTokenCredentials._id)
			user.notes.push(note._id)
			await user.save()
		}



		res.send(
			JSON.stringify({
				Message:
					"Note added!",
			})
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}

async function editNote(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials

		const noteId = req.params.id

		const data = req.body;
		const { title, description } = data


		const note = await findNoteById(noteId)

		note.title = title;
		note.description = description;
		await note.save()

		if (userTokenCredentials) {
			const user = await userModel.findById(userTokenCredentials._id)
			user.notes.push(note._id)
			await user.save()
		}



		res.send(
			JSON.stringify({
				Message:
					"Note edited!",
			})
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}

async function deleteNote(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials

		const noteId = req.params.id


		const note = await noteModel.findByIdAndDelete(noteId)

		if (userTokenCredentials) {
			const user = await userModel.findById(userTokenCredentials._id)
			

			//verify user here
		}



		res.send(
			JSON.stringify({
				Message:
					"Note succesfully deleted!",
			})
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}


module.exports = { createNote, getNotes, deleteNote, editNote };

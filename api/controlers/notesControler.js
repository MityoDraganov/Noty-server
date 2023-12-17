const noteModel = require("../models/note")

const userModel = require("../models/user")

//SERVICES
const { findUserById } = require("../services/userServices");
const { findNoteById } = require("../services/noteServices");




async function noteCreate(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials

		const data = req.body;
		const { title, description } = data


		const note = await noteModel.create({
			title,
			description
		});

		if(userTokenCredentials){
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

async function noteEdit(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials

		const data = req.body;
		const { title, description } = data


		const label = await labelModel.create({
			toSend: labelData,
		});

		if(userTokenCredentials){
			const user = await userModel.findById(userTokenCredentials._id)
			user.purchaseHistory.push(label._id)
			await user.save()
		}



		res.send(
			JSON.stringify({
				Message:
					"Пратката Ви очаква удобрение и скоро ще се погрижим за нея!",
			})
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}

async function noteDelete(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials

		const data = req.body;
		const { title, description } = data


		const label = await labelModel.create({
			toSend: labelData,
		});

		if(userTokenCredentials){
			const user = await userModel.findById(userTokenCredentials._id)
			user.purchaseHistory.push(label._id)
			await user.save()
		}



		res.send(
			JSON.stringify({
				Message:
					"Пратката Ви очаква удобрение и скоро ще се погрижим за нея!",
			})
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}


module.exports = { noteCreate };

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
		}).populate("permitedUsers");

		res.send(JSON.stringify(notes));
	} catch (err) {
		res.status(400).send(err.message);
	}
}

async function createGroup(req, res) {
	try {
		const userCredentials = req.userTokenCredentials

		const data = req.body;
		const { title } = data


		const noteGroup = await noteGroupModel.create({
			title,
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

async function editGroup(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials;
		console.log(userTokenCredentials);
		const groupId = req.params.noteGroupId;
		const { title } = req.body;

		const noteGroup = await noteGroupModel.findById(groupId);
		if (!noteGroup) {
			throw new Error("Note group not found!");
		}
		console.log(noteGroup);

		// Convert the owner ID to a string for comparison
		const ownerIdString = userTokenCredentials._id.toString();

		if (noteGroup.owner.toString() !== ownerIdString) {
			throw new Error("Action not authorized - you are not the owner of the group!");
		}

		noteGroup.title = title;
		await noteGroup.save();

		res.send(JSON.stringify(noteGroup));
	} catch (err) {
		res.status(400).send(err.message);
	}
}


// async function addUserToGroup(req, res) {
// 	try {
// 		const userTokenCredentials = req.userTokenCredentials
// 		const groupId = req.params.id
// 		const { userEmail } = req.body

// 		const noteGroup = await noteGroupModel.findById(groupId)

// 		if(noteGroup.owner !== userTokenCredentials._id){
// 			throw new Error("Action not authorized - you are not the owner of the group!")
// 		}

// 		const user = await userModel.findOne({
// 			email: userEmail
// 		})

// 		if(!user){
// 			throw new Error("User not found!")
// 		}

// 		noteGroup.permitedUsers.push(user._id)
// 		await noteGroup.save()

// 		res.send(
// 			JSON.stringify(noteGroup)
// 		);
// 	} catch (err) {
// 		res.status(400).send(err.message);
// 	}
// }

async function deleteUserFromGroup(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials;
		const { userId } = req.body;
		const noteGroupId = req.params.noteGroupId;

		const noteGroup = await noteGroupModel.findById(noteGroupId);

		if (!noteGroup) {
			throw new Error("Note group not found!");
		}

		if (!noteGroup.owner.equals(userTokenCredentials._id)) {
			throw new Error("Action not authorized - you are not the owner of the group!");
		}

		// Remove the specified user from permitedUsers array
		noteGroup.permitedUsers.pull(userId);

		// Save the updated noteGroup
		await noteGroup.save();

		res.send(JSON.stringify(noteGroup.permitedUsers));
	} catch (err) {
		res.status(400).send({ Message: err.message });
	}
}

async function getMyPermitedNoteGroups(req, res) {
    try {
        const userTokenCredentials = req.userTokenCredentials;

        // Find note groups where the user is permitted but is not the owner
        const noteGroups = await noteGroupModel.find({
            owner: { $ne: userTokenCredentials._id }, // Owner is not the user
            permitedUsers: userTokenCredentials._id, // User is in the permitedUsers array
        });

        if (!noteGroups) {
            throw new Error("No note groups found for the user!");
        }

        res.send(JSON.stringify(noteGroups));
    } catch (err) {
        res.status(400).send({ Message: err.message });
    }
}


async function removeMyselfFromGroup(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials;
		const noteGroupId = req.params.noteGroupId;

		const noteGroup = await noteGroupModel.findById(noteGroupId);

		if (!noteGroup) {
			throw new Error("Note group not found!");
		}

		if (noteGroup.owner.equals(userTokenCredentials._id)) {
			throw new Error("Action not authorized - you ARE the owner of the group!");
		}

		// Remove the specified user from permitedUsers array
		noteGroup.permitedUsers.pull(userTokenCredentials._id);

		// Save the updated noteGroup
		await noteGroup.save();

		res.send(JSON.stringify(noteGroup.permitedUsers));
	} catch (err) {
		res.status(400).send({ Message: err.message });
	}
}

async function getPermitedUsers(req, res) {
	try {
		const userTokenCredentials = req.userTokenCredentials
		const groupId = req.params.id

		const noteGroup = await noteGroupModel.findById(groupId).populate("permitedUsers")

		if (noteGroup.owner !== userTokenCredentials._id) {
			throw new Error("Action not authorized - you are not the owner of the group!")
		}



		res.send(
			JSON.stringify(noteGroup.permitedUsers)
		);
	} catch (err) {
		res.status(400).send(err.message);
	}
}


module.exports = { createGroup, deleteUserFromGroup, getGroups, editGroup, getPermitedUsers, removeMyselfFromGroup, getMyPermitedNoteGroups };

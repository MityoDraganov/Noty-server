const notificationModel = require("../models/notification")
const userModel = require("../models/user")
const noteGroupModel = require("../models/noteGroup")


async function sendProjectInvite(req, res) {
    try {
        const addresserCredentials = req.userTokenCredentials;
        const { userId, projectId } = req.body;

        // Check if there is already a notification for the same project and user
        const existingNotification = await notificationModel.findOne({
            type: "invite",
            project: projectId,
            sentBy: addresserCredentials._id,
            addressedTo: userId
        });


        if (existingNotification) {
            throw new Error("Notification for the same project and user already exists");
        }

        const noteGroup = await noteGroupModel.findById(projectId)
        if (noteGroup.permitedUsers.includes(userId)) {
            throw new Error("User already has permision")
        }

        // If no existing notification, create a new one
        const notification = await notificationModel.create({
            type: "invite",
            project: projectId,
            sentBy: addresserCredentials._id,
            addressedTo: userId
        });

        res.send(JSON.stringify(notification));
    } catch (err) {
        res.status(400).send({ Message: err.message });
    }
}

async function acceptProjectInvite(req, res) {
    try {
        const { notificationId } = req.body
        const receiverCredentials = req.userTokenCredentials

        const user = await userModel.findById(receiverCredentials._id)
        const notification = await notificationModel.findById(notificationId)

        if (!user) {
            throw new Error("User not found!")
        }

        if (!notification) {
            throw new Error("Notifications with this id not found!")
        }

        if (!notification.addressedTo.equals(receiverCredentials._id)) {
            throw new Error("Action not authorized!")
        }

        const noteGroup = await noteGroupModel.findById(notification.project)
        noteGroup.permitedUsers.push(user)
        await noteGroup.save()
        await notificationModel.findByIdAndDelete(notificationId)
        res.send(JSON.stringify({ Message: "Succesfuly accepted invite" }))
    } catch (err) {
        res.status(400).send({ Message: err.message });
    }

}

async function rejectProjectInvite(req, res) {
    try {
        const { notificationId } = req.body
        const receiverCredentials = req.userTokenCredentials

        const user = await userModel.findById(receiverCredentials._id)
        const notification = await notificationModel.findById(notificationId)

        if (!user) {
            throw new Error("User not found!")
        }

        if (!notification) {
            throw new Error("Notifications with this id not found!")
        }

        if (!notification.addressedTo.equals(receiverCredentials._id)) {
            throw new Error("Action not authorized!")
        }

        const result = await notificationModel.deleteOne(notification)
        await notificationModel.findByIdAndDelete(notificationId)
        res.send(JSON.stringify(result))

    } catch (err) {
        res.status(400).send({ Message: err.message });
    }
}

module.exports = { sendProjectInvite, acceptProjectInvite, rejectProjectInvite }
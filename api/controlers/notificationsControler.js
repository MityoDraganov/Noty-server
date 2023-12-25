const notificationModel = require("../models/notification")
const userModel = require("../models/user")
const noteGroupModel = require("../models/noteGroup")


async function sendProjectIInvite(req, res) {
    try {
        const addresserCredentials = req.userTokenCredentials
        const { userId, projectId } = req.body

        const notification = await notificationModel.create({
            type: "invite",
            project: projectId,
            sentBy: addresserCredentials._id,
            addressedTo: userId
        })


        res.send(
            JSON.stringify(notification)
        );

    }
    catch (err) {
        res.status(400).send(err.message);
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

        if (notification.addressedTo !== receiverCredentials._id) {
            throw new Error("Action not authorized!")
        }

        const noteGroup = await noteGroupModel.findById(notification.project)
        noteGroup.permitedUsers.push(user)
        await noteGroup.save()
        
    } catch (err) {
        res.status(400).send(err.message);
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

        if (notification.addressedTo !== receiverCredentials._id) {
            throw new Error("Action not authorized!")
        }

        const result = await notificationModel.deleteOne(notification)

        res.send(JSON.stringify(result))
        
    } catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = { sendProjectIInvite, acceptProjectInvite, rejectProjectInvite }
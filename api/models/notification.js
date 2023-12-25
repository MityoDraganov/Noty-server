const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    type: {
        type: String
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'noteGroup',
        required: true
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    addressedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    }
});

const notificationModel = mongoose.model("notification", notificationSchema);

module.exports = notificationModel;
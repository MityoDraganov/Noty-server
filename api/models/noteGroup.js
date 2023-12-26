const mongoose = require("mongoose");

const noteGroupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'note'
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    permitedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    }],
    // visibility: {
    //     type: String,
    //     enum: ["private", "public"],
    //     default: "private",
    //     required: true
    // }
});

const noteModel = mongoose.model("noteGroup", noteGroupSchema);
module.exports = noteModel;

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
    permitedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    }],
    visibility: {
        enum: ["private", "public"]
    }
});

const noteModel = mongoose.model("noteGroup", noteGroupSchema);
module.exports = noteModel;

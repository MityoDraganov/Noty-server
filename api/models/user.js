const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    noteGroups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'noteGroup'
    }]
})

const userModel = mongoose.model("userModel", userSchema)
module.exports = userModel;
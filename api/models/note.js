const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const noteModel = mongoose.model("note", labelSchema);
module.exports = noteModel;

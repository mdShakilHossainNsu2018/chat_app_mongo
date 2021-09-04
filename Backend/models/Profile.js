const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: "Chatroom is required!",
        ref: "User",
    },
        image: {
            type: String,
        },
        sex:{
            type: String,
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
        },

}, {timestamps: true});

module.exports = mongoose.model("Profile", profileSchema);

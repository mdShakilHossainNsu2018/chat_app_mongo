const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatroom: {
        type: String,
        required: "Chatroom is required!",
        ref: "Chatroom",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: "Chatroom is required!",
        ref: "User",
    },
    attachment: {
        type: String,
        default : null
    },
    image: {
        type: String,
        default : null
    },

    message: {
        type: String,
        required: "Message is required!",
    },
}, { timestamps: {} });

module.exports = mongoose.model("Message", messageSchema);
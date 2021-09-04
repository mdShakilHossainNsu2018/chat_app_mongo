const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name is required!",
    },
    _id: {
        type: String,
        // default:
    },
    isPublic: {
        type: Boolean,
        default: true,
    }
    // users: [{type:mongoose.Schema.Types.ObjectId, ref: 'User',}]
}, { timestamps: {}, _id: false });

module.exports = mongoose.model("Chatroom", chatroomSchema);
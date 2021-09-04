const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name is required"
    },
    email: {
        type: String,
        required: "Email is required"
    },
    password: {
        type: String,
        required: "Password is required"
    },
    profile: {
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
    }

}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const {ObjectId} = require("mongoose/lib/types");
const Chatroom = mongoose.model("Chatroom");

exports.createChatroom = async (req, res) => {
    const {name, _id, isPublic} = req.body;

    if (isPublic){
        const nameRegex = /^[A-Za-z\s]+$/;

        if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";

        const chatroomExists = await Chatroom.findOne({name});

        if (chatroomExists) throw "Chatroom with that name already exists!";
        const id = ObjectId().toString();
        
        console.log(id)

        const chatroom = new Chatroom({
            isPublic: isPublic,
            name,
            _id: id,

        });

        await chatroom.save();
    } else {
        // const nameRegex = /^[A-Za-z\s]+$/;
        //
        // if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";

        const chatroomExists = await Chatroom.findOne({name});

        if (chatroomExists) throw "Chatroom with that name already exists!";

        // const id = ObjectId(_id)

        const chatroom = new Chatroom({
            isPublic: isPublic,
            name,
            _id,
        });

        await chatroom.save();
    }


    res.json({
        message: "Chatroom created!",
    });
};

exports.getAllChatrooms = async (req, res) => {

    const chatrooms = await Chatroom.find({});

    res.json(chatrooms)
};
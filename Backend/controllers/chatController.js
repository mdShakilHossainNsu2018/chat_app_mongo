const mongoose = require("mongoose");

const Message = mongoose.model("Message");

exports.getMessagesByChatroom  = async (req, res) => {
    const chatroomId = req.query.chatroomId;
   const messages = await Message.find({chatroom: chatroomId}).populate('user');

   res.json(messages)
}
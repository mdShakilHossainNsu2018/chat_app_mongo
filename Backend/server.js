// global.TextEncoder = require("util").TextEncoder;
require("dotenv").config();

const mongoose = require("mongoose")

mongoose.connect(process.env.DATABASE,  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

mongoose.connection.on("error", (err) => {
    console.log("Mongoose error " + err.message);
});

mongoose.connection.once("open", () => {
    console.log("mongoose started");
});

// import model
require("./models/Chatroom");
require("./models/User");
require("./models/Message");
require("./models/Profile");


const app = require('./app');

const server = app.listen(8000, () => {
    console.log("server listening on port http://localhost:8000")
})

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});
const jwt = require("jwt-then");

const Message = mongoose.model("Message")
const User = mongoose.model("User")


io.use( async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userId = payload.id;
        next();
    } catch (e){

    }

})

io.on("connection", (socket) => {
    console.log(socket.userId);

    socket.on("disconnect", () => {
        console.log("Disconnected: " + socket.userId);
    });

    socket.on("joinRoom", ({chatroomId}) => {
        socket.join(chatroomId);
        console.log("A user joined chatRoom: "+ chatroomId);
    });

    socket.on("leaveRoom", ({chatroomId}) => {
        socket.join(chatroomId);
        console.log("A user leave chatRoom: "+ chatroomId);
    });

    socket.on("chatroomMessage", async ({chatroomId, message}) => {
        if(message.trim().length > 0){
            const user = await User.findOne({_id: socket.userId});
            // console.log("User:",user)
            const messageMongo = new Message({
                chatroom: chatroomId,
                user: socket.userId,
                message
            });


            io.to(chatroomId).emit("newMessage", {
                message,
                name: user.name,
                user: user
            });

            // console.log("chat roomid done initialized")

            await messageMongo.save();
            // console.log("chat room finished")
        }

    })
})
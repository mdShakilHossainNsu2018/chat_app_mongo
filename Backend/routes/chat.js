const router = require("express").Router();
const {catchErrors} = require("../handlers/errorHandlers");
const chatController = require("../controllers/chatController");

const auth = require("../middlewares/auth");

router.get("/messages_by_chatroom", auth, catchErrors(chatController.getMessagesByChatroom));
// router.post("/", auth, catchErrors(chatroomController.createChatroom));


module.exports = router;
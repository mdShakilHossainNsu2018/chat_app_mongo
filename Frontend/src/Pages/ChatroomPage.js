import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
// import {makeStyles} from "@material-ui/core/styles";
import {TextField} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import Fab from "@material-ui/core/Fab";


// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   textField: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1),
//     width: '25ch',
//   },
// }));


const ChatroomPage = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
  };

  const getMessagesByChatroom = () => {
    axios
        .get("http://localhost:8000/chat/messages_by_chatroom", {
          params: {
            chatroomId: chatroomId,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          },
        })
        .then((response) => {
          setMessages(response.data);
          console.log(response.data)
        })
        .catch((err) => {
          console.error(err);
          // setTimeout(getChatrooms, 3000);
        });
  };

  React.useEffect(() => {
    getMessagesByChatroom();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }

    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    //eslint-disable-next-line
  }, [messages]);

  React.useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    //eslint-disable-next-line
  }, [socket]);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom Name</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              <span
                className={
                  userId === message.user._id ? "ownMessage" : "otherMessage"
                }
              >
                {message.user.name}:
              </span>{" "}
              {message.message}
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>

            <TextField
                id="filled-full-width"
                label="Say something!"
                // style={{ margin: 8 }}
                placeholder="eg: hi"
                // helperText="Full width!"
                fullWidth
                // margin="normal"
                inputRef={messageRef}

                // variant="filled"
            />

            {/*<input*/}
            {/*  type="text"*/}
            {/*  name="message"*/}
            {/*  placeholder="Say something!"*/}
            {/*  ref={messageRef}*/}
            {/*/>*/}
          </div>
          <div>
            <Fab color="primary" onClick={sendMessage} aria-label="add"><SendIcon /></Fab>
            {/*<button className="join" onClick={sendMessage}>*/}
            {/*  Send*/}
            {/*</button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatroomPage);

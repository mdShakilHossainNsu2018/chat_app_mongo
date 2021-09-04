import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { FixedSizeList } from 'react-window';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import axios from "axios";
import makeToast from "../Toaster";
import {useHistory, withRouter} from "react-router-dom";


const useStyles = makeStyles({
    root: {
        width: '100%',
        height: 400,
        maxWidth: 300,
        // backgroundColor: theme.palette.background.paper,
    },
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});



const PrivateChat = ({ match, socket }) => {
    const chatroomId = match.params.id;
    const [users, setUsers] = React.useState([]);

    const [messages, setMessages] = React.useState([]);
    const messageRef = React.useRef();
    const [userId, setUserId] = React.useState("");

    const [me, setMe] = React.useState(null);
    const history = useHistory();

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
        createChatroom(chatroomId);
        // eslint-disable-next-line
      }, [chatroomId]);

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
              console.log("leaving")
            socket.emit("leaveRoom", {
              chatroomId,
            });
          }
        };
        //eslint-disable-next-line
      }, [socket, chatroomId]);



    React.useEffect(() => {
        axios
            .get("http://localhost:8000/user/getUsers", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("CC_Token"),
                },
            })
            .then((response) => {
                setUsers(response.data);
                console.log(response.data);
            })
            .catch((err) => {
                // setTimeout(getChatrooms, 3000);
            });

    // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        axios
            .get("http://localhost:8000/user/get_me", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("CC_Token"),
                },
            })
            .then((response) => {
                setMe(response.data);
                console.log(response.data);
            })
            .catch((err) => {
                // setTimeout(getChatrooms, 3000);
            });

    // eslint-disable-next-line
    }, []);

    const createChatroom = (chatroomId) => {
        axios
            .post("http://localhost:8000/chatroom", {name: chatroomId, isPublic: false, _id: chatroomId},  {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("CC_Token"),
                },
            })
            .then((response) => {
                makeToast("success", response.data.message);
            })
            .catch((err) => {
                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                )
                    console.log(err);
                    // makeToast("Success", err.response.data.message);
            });
    }



    const onClickUser = (index) => {
        // console.log(users[index]._id, me._id);
        let chatroomId;
        const user = users[index].user._id
        if(me.user._id>user){
            chatroomId = me.user._id + user;
        } else{
            chatroomId = user + me.user._id;
        }

        console.log(chatroomId);
        createChatroom(chatroomId);
        history.push("/chatroom/private/"+chatroomId)
    }

    const classes = useStyles();

    function renderMessage(props){
        // eslint-disable-next-line
        const {index, style} = props;

        return (
            <ListItem key={messages[index]._id} >
                <Grid container>
                    <Grid item xs={12}>
                        <ListItemText align={userId === messages[index].user._id? "right": "left"} primary={messages[index].message}>{messages[index].message}</ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                        <ListItemText align={userId === messages[index].user._id? "right": "left"} secondary={messages[index].createdAt}></ListItemText>
                    </Grid>
                </Grid>
            </ListItem>

        );
    }


    function renderRow(props) {
        const { index, style } = props;

        return (
            userId !== users[index].user._id ?
            <ListItem button onClick={() => onClickUser(index)} style={style} key={users[index].user._id}>
                <ListItemIcon>
                    {
                        users[index].profile !== null ?
                            <Avatar alt={users[index].user.name} src={"http://localhost:8000/static/"+users[index].profile.image} />
                            : <Avatar alt={users[index].user.name} />
                    }

                </ListItemIcon>
                <ListItemText primary={users[index].user.name}>{users[index].user.name}</ListItemText>
                <ListItemText secondary="online" align="right"></ListItemText>
            </ListItem>: ""
        );
    }

    return (
        <div>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>
                    <List >
                        { me !== null?
                            <ListItem button key="RemySharp">
                                <ListItemIcon>
                                    {

                                        me.profile !== null ?
                                            <Avatar alt={me.user.name}
                                                    src={"http://localhost:8000/static/" + me.profile.image}/>
                                            : <Avatar alt={me.user.name}/>
                                    }

                                </ListItemIcon>
                                <ListItemText primary={me.user.name}>{me.user.name}</ListItemText>

                                <ListItemText secondary={me.user.email}>
                                </ListItemText>

                            </ListItem> : ""
                        }
                    </List>
                    <Divider />
                    <Grid item xs={12} style={{padding: '10px'}}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                    </Grid>
                    <Divider />
                    <FixedSizeList height={400} width={350} itemSize={46} itemCount={users.length}>
                        {renderRow}
                    </FixedSizeList>
                </Grid>
                <Grid item xs={9}>
                    {/*<Box mt={3}>*/}
                    <FixedSizeList  height={650} maxWidth={350} itemSize={406} itemCount={messages.length} className={classes.messageArea}>
                        {renderMessage}
                    </FixedSizeList>
                    {/*</Box>*/}
                    <Divider />
                    <Grid container style={{padding: '20px'}}>
                        <Grid item xs={11}>
                            <TextField inputRef={messageRef} id="outlined-basic-email" label="Type Something" fullWidth />
                        </Grid>
                        <Grid item align="right">
                            <Fab color="primary" onClick={sendMessage} aria-label="add"><SendIcon /></Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default withRouter(PrivateChat);
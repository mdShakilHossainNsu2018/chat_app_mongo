import React from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import makeToast from "../Toaster";
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import {Box, Card, Container, Divider} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";



const cardStyles = makeStyles((theme) => ({
    root: {
        minWidth: 445,
        minHeight: 400,
        // textAlign: 'center'
        padding: theme.spacing(5)
    },
    media: {
        height: 140,
    },
}));


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing(5),
    },
    paper: {
        padding: theme.spacing(2),
        // textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));


const DashboardPage = (props) => {
    const classes = useStyles();
    const cardClasses = cardStyles();
    const chatroomNameRef = React.createRef();
    const [users, setUsers] = React.useState([]);
    const [chatrooms, setChatrooms] = React.useState([]);
    const [userId, setUserId] = React.useState("");


    // const setChatrooms = () => {
    //
    // }
    const getChatrooms = () => {
        axios
            .get("http://localhost:8000/chatroom", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("CC_Token"),
                },
            })
            .then((response) => {
                setChatrooms(response.data);
            })
            .catch((err) => {
                console.log(err);
                // setTimeout(getChatrooms, 3000);
            });
    };

    const createChatroom = () => {
        axios
            .post("http://localhost:8000/chatroom", {name: chatroomNameRef.current.value, isPublic: true}, {
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
                    makeToast("error", err.response.data.message);
            });
    }

    React.useEffect(() => {
        getChatrooms();
        // eslint-disable-next-line
    }, [chatrooms]);

    React.useEffect(() => {
        const token = localStorage.getItem("CC_Token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.id);
        }
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

    const getChatroomId = (id) => {
        let chatroomId;
        if(userId>id){
            chatroomId = userId + id;
        } else{
            chatroomId = id + userId;
        }
        return chatroomId;
    }

    return (
        <Container>
            {/*<Card className={classes.root}>*/}


            <Grid className={classes.root} container spacing={3}>
                <Grid item xs={6}>
                    <Card className={cardClasses.root}>
                        <div className="cardHeader">Chatrooms</div>

                        <div className="cardBody">

                            <form className={classes.root} noValidate autoComplete="off">

                                <TextField
                                    label="Chatroom Name"
                                    variant="outlined"
                                    type="text"

                                    id="chatroomName"
                                    placeholder="ChatterBox Nepal"
                                    inputRef={chatroomNameRef}
                                />
                            </form>

                            <Box ml={.5} mt={4} pb={3}>


                                <Button variant="contained" onClick={createChatroom} color="primary">
                                    Create Chatroom
                                </Button>
                            </Box>
                        </div>

                        {/*<button >Create Chatroom</button>*/}
                        <Divider variant="middle"/>
                        <div className="chatrooms">
                            {chatrooms.filter((chatroom) => chatroom.isPublic).map((chatroom) => (
                                <div key={chatroom._id} className="chatroom">
                                    <div>{chatroom.name.toUpperCase()}</div>
                                    <Link to={"/chatroom/" + chatroom._id}>
                                        <div className="join">Join</div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card className={cardClasses.root}>
                        <List>
                        {users.filter((user) => user.user._id !== userId).map((userObj) => (
                            <Link to={"chatroom/private/" + getChatroomId(userObj.user._id)} key={userObj.user._id}>
                            <ListItem >
                                <ListItemIcon>
                                    {
                                        userObj.profile !== null? <Avatar alt={userObj.user.name} src={"http://localhost:8000/static/"+userObj.profile.image}/>:
                                            <Avatar alt={userObj.user.name} />
                                    }


                                </ListItemIcon>
                                <ListItemText primary={userObj.user.name}>{userObj.user.name}</ListItemText>
                                <ListItemText secondary="online" align="right"></ListItemText>
                            </ListItem>
                            </Link>
                        ))}
                        </List>
                    {/*    <FixedSizeList  height={400} width={400} itemSize={46} itemCount={users.length}>*/}
                    {/*        {renderRow}*/}
                    {/*    </FixedSizeList>*/}
                    </Card>
                </Grid>
            </Grid>
            {/*</div>*/}
        </Container>
    );
};

export default DashboardPage;

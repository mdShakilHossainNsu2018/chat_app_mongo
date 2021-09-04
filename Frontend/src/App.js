import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import IndexPage from "./Pages/IndexPage";
import ChatroomPage from "./Pages/ChatroomPage";
import io from "socket.io-client";
import makeToast from "./Toaster";

import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import PrivateChat from "./Pages/PrivateChatroomPage";
import Avatar from "@material-ui/core/Avatar";
import {Box, MenuItem} from "@material-ui/core";
import ProfilePage from "./Pages/ProfilePage";



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


function App() {

    const classes = useStyles();

    const [socket, setSocket] = React.useState(null);
    const [userDetails, setUserDetails] = React.useState(null);


    const logOut = () => {
        localStorage.clear();
        window.location.href = "/login";
    }


    const setupSocket = () => {
        const token = localStorage.getItem("CC_Token");
        if (token && !socket) {
            const userDetails = localStorage.getItem("userDetails");

            setUserDetails(JSON.parse(userDetails));
            console.log(userDetails);
            const newSocket = io("http://localhost:8000", {
                query: {
                    token: localStorage.getItem("CC_Token"),
                },
            });

            newSocket.on("disconnect", () => {
                setSocket(null);
                setTimeout(setupSocket, 3000);
                makeToast("error", "Socket Disconnected!");
            });

            newSocket.on("connect", () => {
                console.log("connect");
                makeToast("success", "Socket Connected!");
            });

            setSocket(newSocket);
        }
    };

    React.useEffect(() => {

        const token = localStorage.getItem("CC_Token");
        if (token) {
            const uDetails = localStorage.getItem("userDetails");
            setUserDetails(JSON.parse(uDetails));

        }
        console.log("from app",userDetails);
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {

        setupSocket();
        //eslint-disable-next-line
    }, []);

    return (

        // <Container>
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Chat App
                    </Typography>
                    { localStorage.getItem("CC_Token") ?
                        <Box display="flex" >
                            <MenuItem>
                                <Button color="inherit" onClick={logOut}>Log Out</Button>
                            </MenuItem>
                            <a href="/profile">
                                <MenuItem>
                                    {
                                        userDetails !==null ?
                                            <Avatar  src={"http://localhost:8000/static/"+userDetails.profile.image}/>
                                            :
                                            <Avatar />
                                    }

                                </MenuItem>
                            </a>



                        </Box>

                        :
                        <Button color="inherit" href="/login">Login</Button>}


                </Toolbar>
            </AppBar>

            <BrowserRouter>

                <Switch>
                    <Route path="/" component={IndexPage} exact/>
                    <Route
                        path="/login"
                        render={() => <LoginPage setupSocket={setupSocket}/>}
                        exact
                    />
                    <Route path="/register" component={RegisterPage} exact/>
                    <Route
                        path="/dashboard"
                        render={() => <DashboardPage socket={socket}/>}
                        exact
                    />
                    <Route
                        path="/chatroom/:id"
                        render={() => <ChatroomPage socket={socket}/>}
                        exact
                    />

                    <Route
                        path="/chatroom/private/:id"
                        render={() => <PrivateChat socket={socket}/>}
                        exact
                    />
                    <Route
                        path="/profile"
                        exact
                        render={() => <ProfilePage/>}
                    />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;

import React from "react";
import makeToast from "../Toaster";
import axios from "axios";
import {useHistory, withRouter} from "react-router-dom";
import {Card, Container, CssBaseline, Icon} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import {ImportContactsOutlined, PhotoCamera} from "@material-ui/icons";
import {setMe} from "../helper/helper";


const uploadButtonStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
}));


const ProfilePage = () => {
    const history = useHistory();
    const [file, setFile] = React.useState([]);
    const [userDetails, setUserDetails] = React.useState(null);
    const classes = uploadButtonStyles();


    const uploadProfile = () => {
// Create an object of formData
        const formData = new FormData();

        const token = localStorage.getItem("CC_Token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            // setUserId(payload.id);

            formData.append(
                "avatar",
                file,
                file.name
            );
            formData.append("user", payload.id);

            // Details of the uploaded file
            console.log(file);

            // Request made to the backend api
            // Send formData object
            axios.post("http://localhost:8000/user/profile", formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("CC_Token"),
                },
            }).then((res) =>{
                console.log(res);
                makeToast("success", "Success fully uploaded.")
                setMe();
                history.push("/");

                window.location.reload();
            }).catch((err) => {
                console.log(err)
                makeToast("error", "Something went wrong")
            });
        }

        // Update the formData object

    }

    // On file select (from the pop up)
    const onFileChange = event => {

        // Update the state
        setFile(event.target.files[0])
        // this.setState({ selectedFile:  });

    };

    React.useEffect(() => {
        const token = localStorage.getItem("CC_Token");
        if (token) {
            const uDetails = localStorage.getItem("userDetails");
            setUserDetails(JSON.parse(uDetails));

        }
        // console.log("from app",userDetails.profile.image);
    }, [])


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline>
                <h1>Profile page.</h1>

                <Card>
                    {
                        userDetails !==null ?
                            <img alt={"kjkjf kjflkdajl"} src={"http://localhost:8000/static/"+userDetails.profile.image} />
                            :
                            <Icon>
                                <ImportContactsOutlined/>
                            </Icon>
                    }

                </Card>

                <div className={classes.root}>
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        onChange={onFileChange}

                        type="file"
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="primary" component="span">
                            <PhotoCamera /> Upload Profile Photo
                        </Button>
                    </label>
                    {/*{file.name.toString()}*/}
                    <Button onClick={uploadProfile} variant="contained" color="primary" component="span">
                        <PhotoCamera /> Upload
                    </Button>

                </div>
            </CssBaseline>
        </Container>
    );
};

export default withRouter(ProfilePage);

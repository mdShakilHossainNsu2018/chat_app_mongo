import axios from "axios";

export const setMe = () => {
    axios
        .get("http://localhost:8000/user/get_me", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("CC_Token"),
            },
        })
        .then((response) => {
            localStorage.setItem("userDetails", JSON.stringify(response.data));
            // setMe(response.data);
            console.log(response.data);
        })
        .catch((err) => {
            // setTimeout(getChatrooms, 3000);
        });
}
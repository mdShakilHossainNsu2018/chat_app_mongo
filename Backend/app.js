const express = require('express');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup Cross Origin
let cors = require('cors');
app.use(cors());

app.use("/static",express.static('public'));

// Bring in the the router
app.use("/user",require("./routes/user"));
app.use("/chatroom",require("./routes/chatroom"));
app.use("/chat",require("./routes/chat"));

// setup error handlers
const errorHandlers = require("./handlers/errorHandlers");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENV === "DEVELOPMENT") {
    app.use(errorHandlers.developmentErrors);
} else {
    app.use(errorHandlers.productionErrors);
}



module.exports = app;
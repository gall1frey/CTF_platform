const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//Setting up express
const app = express();
app.use(express.json());
app.use(cors());

//setting up socket io
const http = require('http').Server(app);
const io = require('socket.io')(http);

//Server online
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

//Setting up mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
});
mongoose.set('useFindAndModify', false);
//Setting up socket io for live update of ranks and scoreboard
io.listen(8000);
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('User Disconnected');
    });
});

//Set up routes
app.use((req, res, next) => { res.locals['socketio'] = io; next(); });
app.use("/users", require("./routes/userRouter"));
app.use("/admin", require("./routes/adminChallRouter"));
app.use("/challenges", require("./routes/challRouter"));

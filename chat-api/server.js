const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const cors = require('cors');
const mongoose = require('mongoose');

const user = require('./app/user');
const chat = require('./app/chat');
const config = require('./config');



app.use(cors());
app.use(express.json());

const port = 8000;

mongoose.connect(config.dbUrl, config.mongoOptions).then(() => {
    app.use('/user', user);
    app.use('/chat', chat);
});


app.listen(port, () => {
    console.log(`Server started on ${port} port`);
});
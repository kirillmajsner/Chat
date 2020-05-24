const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const user = require('./app/user');
const config = require('./config');



app.use(cors());
app.use(express.json());

const port = 8000;

mongoose.connect(config.dbUrl, config.mongoOptions).then(() => {
    app.use('/user', user);
});


app.listen(port, () => {
    console.log(`Server started on ${port} port`);
});
const mongoose = require('mongoose');
const config = require('./config');
const {nanoid} = require('nanoid');

const User = require('./models/User');

const run = async () => {


    await mongoose.connect(config.dbUrl, config.mongoOptions);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();

    for (let collection of collections) {
        await collection.drop();
    }


    const users = await User.create({
        username: 'user',
        password: 'user',
        token: nanoid()
    }, {
        username: 'user2',
        password: 'user',
        token: nanoid()
    });


    return connection.close();
};

run().catch(error => {
    console.error('Something went wrong!', error);
});
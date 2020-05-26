const express = require('express');
const nanoid = require('nanoid');

const User = require('../models/User');
const Messages = require('../models/Messages');

const router = express.Router();

const activeConnections = {};

router.ws('/', async (ws, req) => {
    const token = req.query.token;

    if(!token) {
        return ws.close();
    }

    const user = await User.findOne({token});

    if(!user) {
        return ws.close();
    }

    const id = nanoid();
    activeConnections[id] = {user, ws};

    const userNames = Object.keys(activeConnections).map(connId => {
        const conn = activeConnections[connId];

        return {username: conn.user.username, id: conn.user._id, role: conn.user.role}
    });

    ws.send(JSON.stringify({
        type: "ACTIVE_USERS",
        userNames,
    }));

    ws.send(JSON.stringify({
        type: "LATEST_MESSAGES",
        messages: await Messages.find().sort({datetime: -1}).limit(-30)
    }));

    Object.keys(activeConnections).map(connId => {
        const conn = activeConnections[connId];

        conn.ws.send(JSON.stringify({
            type: 'NEW_USER',
            author: {
                username: user.username,
                id: user._id
            },

        }))
    });

    ws.on('message', msg => {
        let decodedMessage;

        try{
            decodedMessage = JSON.parse(msg);
        } catch(e) {
            return console.log('Not a valid message')
        }

        switch(decodedMessage.type) {
            case 'CREATE_MESSAGE':

                const message = {
                    author: decodedMessage.author,
                    message: decodedMessage.message,
                    datetime: new Date().toISOString()
                };

                const messages = new Messages(message);
                messages.save();

                Object.keys(activeConnections).map(connId => {
                    const conn = activeConnections[connId];
                    conn.ws.send(JSON.stringify({
                        type: 'NEW_MESSAGE',
                        message
                    }))
                });

                break;
            default:
                console.log('Not valid message type, ', decodedMessage.type);
        }

    });

    ws.on('close', msg => {
        console.log('client disconnected id=', id);
        delete activeConnections[id];

        Object.keys(activeConnections).map(connId => {
            const conn = activeConnections[connId];

            conn.ws.send(JSON.stringify({
                type: 'DELETE_USER',
                username: user.username,
                id: user._id,
                role: user.role
            }))
        });
    });
});


module.exports = router;
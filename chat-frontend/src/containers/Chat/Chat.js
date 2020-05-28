import React, {Component} from 'react';
import {connect} from "react-redux";
import {Button, Form, FormGroup, Input} from "reactstrap";
import {NotificationManager} from 'react-notifications';

import './Chat.css';
import {Redirect} from "react-router-dom";

class Chat extends Component {
    state = {
        activeUsers: [],
        message: '',
        messages: []
    };

    connect = () => {
        let url = 'ws://localhost:8000/chat';
        if (this.props.user) {
            url += `?token=${this.props.user.token}`
        }
        this.websocket = new WebSocket(url);

        this.websocket.onmessage = event => {
            const message = JSON.parse(event.data);
            if (message.type === 'LATEST_MESSAGES') {
                this.setState({
                    messages: message.messages.reverse()
                })
            }
        }
    };

    componentDidMount() {
        this.connect();

        this.websocket.onmessage = event => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case 'ACTIVE_USERS':
                    this.setState({
                        activeUsers: message.userNames
                    });
                    break;
                case 'NEW_USER':
                    NotificationManager.success(`${message.author.username} joined to the chat`);
                    if (this.props.user && this.props.user._id === message.author.id) {
                        return null
                    } else {
                        return this.setState({
                            activeUsers: [
                                ...this.state.activeUsers,
                                message.author
                            ]
                        })
                    }
                case 'DELETE_USER':
                    this.setState({
                        activeUsers: this.state.activeUsers.filter(u => u.username !== message.username)
                    });
                    NotificationManager.success(`${message.username} left chat`);
                    break;
                case 'LATEST_MESSAGES':
                    this.setState({
                        messages: message.messages.reverse()
                    });
                    break;
                case 'NEW_MESSAGE':
                    this.setState({
                        messages: [
                            ...this.state.messages,
                            message.message
                        ]
                    });
                    break;
                default:
                    break;
            }
        };

        const ws = this.connect;
        this.websocket.onclose = () => {
            //clearInterval(this.interval);
            this.interval = setInterval(function () {
                ws();
            }, 3000);
        }
    }

    componentDidUpdate() {
        const chat = document.getElementById("chat");
        if (chat) {
            chat.scrollTop = chat.scrollHeight;
        } else {
            return null
        }
    }

    componentWillUnmount() {
        this.websocket.close()
    };

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    sendMessage = event => {
        event.preventDefault();

        this.websocket.send(JSON.stringify({
            type: 'CREATE_MESSAGE',
            author: this.props.user.username,
            message: this.state.message
        }));
    };


    render() {
        if (!this.props.user) return <Redirect to='/login'/>;
        return (
            <div className="main-chat-block">
                <div className="users-block">
                    <h4>Online users:</h4>
                    {
                        this.state.activeUsers.map(author => {
                            return (
                                <div key={author.id}>{author && author.role === 'moderator' ? (
                                    <p className='moderator'>Moderator: {author.username} </p>) : (
                                    <p>User: {author.username}</p>)}</div>
                            )
                        })
                    }
                </div>
                <div className='chat-block'>
                    <div className="messages-block" id="chat">
                        {
                            this.state.messages.map(author => (
                                <p key={author.datetime}>
                                    {
                                        this.props.user && this.props.user.role === 'moderator' ?
                                            <button
                                                onClick={() => this.props.deleteMessage(author._id)}>Delete</button> : null
                                    }
                                    <strong>{author.author}: </strong>{author.message}</p>
                            ))
                        }
                    </div>
                    <Form inline onSubmit={(event) => this.sendMessage(event)}>
                        <FormGroup>
                            <Input type="text" className='message-input' value={this.state.message}
                                   onChange={this.inputChangeHandler} name="message" placeholder="Enter your message"/>
                        </FormGroup>
                        <Button type="submit" className="send-message">Send</Button>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.users.user,
});


export default connect(mapStateToProps, null)(Chat);
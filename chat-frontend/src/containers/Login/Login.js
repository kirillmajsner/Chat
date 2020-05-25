import React, {Component} from 'react';
import {Col, Form, FormGroup, Button, Alert, Card} from "reactstrap";
import FormElement from "../../components/UI/Form/FormElement";
import {loginUser} from "../../store/actions/usersActions";
import {connect} from 'react-redux'
import {Link} from "react-router-dom";

class Login extends Component {

    state = {
        username: '',
        password: ''
    };

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    submitFormHandler = event => {
        event.preventDefault();

        this.props.loginUser({...this.state});

    };

    render() {
        return (
            <Card body className='card-body mx-auto text-center' style={{maxWidth: '400px', minHeight: '500px'}}>
                <h2>Login</h2>
                <Form onSubmit={this.submitFormHandler}>
                    <FormElement
                        propertyName="username"
                        type="text"
                        title="Username"
                        value={this.state.username}
                        onChange={this.inputChangeHandler}
                        autoComplete="current-username"
                        placeholder="Enter username you registered with"
                    />


                    <FormElement
                        propertyName="password"
                        type="password"
                        title="Password"
                        value={this.state.password}
                        onChange={this.inputChangeHandler}
                        autoComplete="current-password"
                        placeholder="Enter password"
                    />

                    <FormGroup row>
                        <Col>
                            <Button className='btn-block' type="submit" color="secondary">
                                Login
                            </Button>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Col>
                            <p>Not Registered?
                                <Link to={`/register`}> Register</Link>
                            </p>
                        </Col>
                    </FormGroup>
                    {this.props.error &&
                    <Alert color="danger">
                        {this.props.error.error || this.props.error.global}
                    </Alert>
                    }
                </Form>
            </Card>
        )
    }
}


const mapStateToProps = state => ({
    error: state.users.loginError
});

const mapDispatchToProps = dispatch => ({
    loginUser: userData => dispatch(loginUser(userData))
});


export default connect(mapStateToProps, mapDispatchToProps)(Login);
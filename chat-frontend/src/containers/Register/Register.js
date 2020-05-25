import React, {Component} from 'react';
import {Alert, Button, Card, Col, Form, FormGroup} from "reactstrap";
import {registerUser} from "../../store/actions/usersActions";
import {connect} from "react-redux";
import FormElement from "../../components/UI/Form/FormElement";
import {Link} from "react-router-dom";

class Register extends Component {
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

        this.props.registerUser({...this.state});
    };

    getFieldError = fieldName => {
        return this.props.error && this.props.error.errors && this.props.error.errors[fieldName] && this.props.error.errors[fieldName].message;
    };

    render() {
        return (
            <Card body className="text-center mx-auto" style={{maxWidth: '400px', minHeight: '500px'}}>
                <h4>User Registration</h4>
                {this.props.error && this.props.error.global && (
                    <Alert color="danger">
                        {this.props.error.global}
                    </Alert>
                )}

                <Form onSubmit={this.submitFormHandler}>
                    <FormElement
                        propertyName="username"
                        type="text"
                        title="Username"
                        value={this.state.username}
                        onChange={this.inputChangeHandler}
                        error={this.getFieldError('username')}
                        autoComplete="new-username"
                        placeholder="Enter your desired username"
                    />


                    <FormElement
                        propertyName="password"
                        type="password"
                        title="Password"
                        value={this.state.password}
                        onChange={this.inputChangeHandler}
                        error={this.getFieldError('password')}
                        autoComplete="new-password"
                        placeholder="Enter new secure password"
                    />

                    <FormGroup row>
                        <Col sm='12'>
                            <Button className='btn-block' type="submit" color="secondary">
                                Register
                            </Button>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm='12'>
                            <p>Already a member?
                                <Link to={`/login`}> Log in</Link>
                            </p>
                        </Col>
                    </FormGroup>
                </Form>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    error: state.users.registerError
});

const mapDispatchToProps = dispatch => ({
    registerUser: userData => dispatch(registerUser(userData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);

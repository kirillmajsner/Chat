import React, {Component, Fragment} from 'react';
import './App.css'
import {Container} from "reactstrap";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {NotificationContainer} from "react-notifications";


import Routes from "./Routes";
import {logoutUser} from "./store/actions/usersActions";

class App extends Component {
  render() {
    return (
        <Fragment>
          <NotificationContainer/>
          <header>
          </header>
          <Container style={{marginTop: '20px'}}>
            <Routes
                user={this.props.user}
            />
          </Container>
        </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.users.user
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps,)(App));
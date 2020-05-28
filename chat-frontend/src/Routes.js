import React from 'react';
import {Route, Switch, Redirect} from "react-router-dom";

import Register from "./containers/Register/Register";
import Login from "./containers/Login/Login";
import Chat from "./containers/Chat/Chat";


const ProtectedRoute = ({isAllowed, ...props}) => {
    return isAllowed ? <Route {...props}/> : <Redirect to="/login"/>;
};

const Routes = ({user}) => {
    return (
        <Switch>
            <ProtectedRoute
                isAllowed={user}
                path="/"
                exact
                component={Chat}
            />
            <Route path="/register" exact component={Register}/>
            <Route path="/login" exact component={Login}/>
        </Switch>
    )
};

export default Routes;



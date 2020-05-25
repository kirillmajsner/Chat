import React, {Fragment} from 'react';
import {NavLink as RouterNavLink} from "react-router-dom";
import {NavItem, NavLink} from "reactstrap";


const AnonymousMenu = () => (
    <Fragment>
        <NavItem>
            <NavLink tag={RouterNavLink} to="/register" exact>Register</NavLink>
        </NavItem>
        <NavItem>
            <NavLink tag={RouterNavLink} to="/login" exact>Login</NavLink>
        </NavItem>
    </Fragment>
);

export default AnonymousMenu;
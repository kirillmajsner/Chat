import {push} from 'connected-react-router';
import {NotificationManager} from "react-notifications";
import axios from '../../axios-chat';

export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';

export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

export const LOGOUT_USER = 'LOGOUT_USER';


const registerUserSuccess = user => ({type: REGISTER_USER_SUCCESS, user});
const registerUserFailure = error => ({type: REGISTER_USER_FAILURE, error});

export const loginUserSuccess = (data) => ({type: LOGIN_USER_SUCCESS, data});
export const loginUserFailure = error => ({type: LOGIN_USER_FAILURE, error});

export const registerUser = userData => {
    return dispatch => {
        return axios.post('/user', userData).then(
            response => {
                dispatch(registerUserSuccess(response.data.user));
                NotificationManager.success('Registered successfully');
                dispatch(push('/'));
            },
            error => {
                if (error.response) {
                    dispatch(registerUserFailure(error.response.data))
                } else {
                    dispatch(registerUserFailure({global: 'No connection'}))
                }
            }
        )
    }
};

export const loginUser = userData => {
    return dispatch => {
        return axios.post('user/sessions', userData).then(
            response => {
                dispatch(loginUserSuccess(response.data));
                NotificationManager.success('Logged in successfully');
                dispatch(push('/'));
            },
            error => {
                dispatch(loginUserFailure(error.response.data))
            }
        )
    }
};

export const logoutUser = () => {
    return (dispatch, getState) => {
        const token = getState().users.user.token;
        const config = {headers: {'Authorization': token}};

        return axios.delete('/user/sessions', config).then(
            () => {
                dispatch({type: LOGOUT_USER});
                NotificationManager.success('Logged out');
            },
            error => {
                NotificationManager.error('Could not logout!');
            }
        )
    }
};

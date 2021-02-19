import axios from 'axios'
import {
    USER_LOADING,
    LOGIN_SUCCESS,
    RESTORE_TOKEN,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    USER_PROFILE,
    CLEAR_PROFILE,
    INVALID_USER,
    VERIFY_PASSWORD,
    UPDATE_PASSWORD,
    CLEAR_VERIFY_PASSWORD,
    CLEAR_NEW_PASSWORD_DATA,
    DONE_LOADING,
    CONNECTION_STATUS, CONNECTION_CHANGED
} from './types';
import { returnErrors, clearErrors } from '../error/action'
import * as API from '../../../utils/Constants'
import { AsyncStorage } from 'react-native'

export const loginUser = ({ username, password }) => (dispatch, getState) => {
    dispatch({ type: USER_LOADING })

    // Headers
    const config = {
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }
    // const httpsAgent = new https.Agent({ ca: fs.readFileSync('../../../ssl/fullchain2.pem') })
    const body = JSON.stringify({ username, password })

    console.log(API.LOGIN_USER, body)

    // let token = "token"
    // console.log(token)
    // _storeData(token)
    // dispatch({
    //     type: LOGIN_SUCCESS,
    //     payload: token,
    // })
    axios
        .post(API.LOGIN_USER, body, config)
        .then((res) => {
            console.log(res.data)
            const payload = {
                userId: res.data.data.messenger.id,
                token: res.data.data.token,
                data: res.data.data,
                password: password
            }

            _storeData(res.data)
            dispatch({
                type: LOGIN_SUCCESS,
                payload: payload,
            })
            // dispatch(loadUser())
        })
        .catch((err) => {
            console.log(err.response)
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    let errMessage = "Cannot connect to server. Please contact administrator.", path = "connection"
                    if (!!err.response.data) {
                        if (!!err.response.data.message) {
                            errMessage = err.response.data.message
                            path = "invalid"
                        }
                    }
                    errors = [{ "errMessage": errMessage, "path": path, }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )
                dispatch({
                    type: LOGIN_FAIL,
                })
            }
        })
}

export const logoutUser = () => (dispatch, getState) => {

    // Headers
    const config = tokenConfig(getState)

    const body = JSON.stringify({})
    axios
        .post(API.LOGOUT_USER, body, config)
        .then((res) => {
            console.log(res.data)

            dispatch(clearErrors())
            dispatch({
                type: LOGOUT_SUCCESS,
            })
        })
        .catch((err) => {
            console.log(err.response)
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    let errMessage = "Cannot connect to server. Please contact administrator.", path = "connection"
                    if (!!err.response.data) {
                        if (!!err.response.data.message) {
                            errMessage = err.response.data.message
                            path = "invalid"
                        }
                    }
                    errors = [{ "errMessage": errMessage, "path": path, }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )
                dispatch({
                    type: LOGIN_FAIL,
                })
            }
        })
}

export const userProfile = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING })

    // Headers
    const config = tokenConfig(getState)

    axios
        .get(API.USER_PROFILE, config)
        .then((res) => {
            console.log(res.data)
            dispatch({
                type: USER_PROFILE,
                payload: res.data.data,
            })
        })
        .catch((err) => {
            console.log(err)
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )
                dispatch(invalidUser())
            }
        })
}

export const clearUserProfile = () => (dispatch) => {
    dispatch({
        type: CLEAR_PROFILE
    })
}

export const invalidUser = () => (dispatch) => {
    dispatch({
        type: INVALID_USER,
    })
}

export const connectionStatus = (type: any, status: any) => (dispatch, getState) => {
    const currentStatus = getState().auth.connection.status
    let haveChanged = false;
    if (currentStatus != status) haveChanged = true;
    dispatch({
        type: CONNECTION_STATUS,
        payload: {
            type,
            status,
            haveChanged
        }
    })
}

export const connectionChanged = (status: any) => (dispatch) => {
    dispatch({
        type: CONNECTION_CHANGED,
        payload: status
    })
}

export const verifyPassword = (currentPassword: any) => (dispatch, getState) => {
    dispatch({ type: USER_LOADING })

    // Headers
    const config = tokenConfig(getState)
    const body = JSON.stringify({ current_password: currentPassword })
    axios
        .put(API.VERIFY_PASSWORD, body, config)
        .then((res) => {
            dispatch({
                type: VERIFY_PASSWORD,
                payload: res.data.data
            })
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )
                dispatch({ type: DONE_LOADING })
            }
            console.log(err)
        })
}

export const updatePassword = ({ new_password, re_password, current_password }: any) => (dispatch, getState) => {
    dispatch({ type: USER_LOADING })
    // Headers
    const config = tokenConfig(getState)
    const body = JSON.stringify({ new_password, re_password, current_password })
    axios
        .put(API.UPDATE_PASSWORD, body, config)
        .then((res) => {
            dispatch({
                type: UPDATE_PASSWORD,
                payload: res.data.data
            })
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )
                dispatch({ type: DONE_LOADING })
            }
            console.log(err)
        })
}

export const clearVerifyPassword = () => {
    return {
        type: CLEAR_VERIFY_PASSWORD,
    }
}

export const restoreToken = () => dispatch => {
    AsyncStorage.getItem('userToken').then((value) => {
        let data = { token: value, auth: false }
        if (value) data.auth = true
        dispatch({
            type: RESTORE_TOKEN,
            payload: data,
        })
        dispatch(userProfile())
    }).catch((error) => {
        dispatch({
            type: LOGIN_FAIL,
        })
    })
}
export const clearNewPassword = () => {
    return {
        type: CLEAR_NEW_PASSWORD_DATA
    }
}

const _storeData = async (data: { data: { token: any; }; }) => {
    try {
        const user = data.data.token

        await AsyncStorage.setItem('userToken', JSON.stringify(user));
        console.log('Saving user data', user);
        // props.navigation.replace('PageNavigation');
    } catch (error) {
        // alert(`Data saving error, ${error}`);
        console.log(error);
    }
}

// Setup config/Headers and token
export const tokenConfig = (getState: any) => {
    // Get token from local storage
    const token = getState().auth.token;
    console.log('Token Config', token)

    // Headers
    let config = {
        headers: {
            'Content-type': 'application/json',
        },
    }

    // If token, add to headers
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
    }

    console.log('Config', config)
    return config
}
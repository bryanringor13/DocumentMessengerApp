import axios from 'axios'
import {
    GET_COUNT,
    DEDUCT_COUNT,
} from './types';
import { returnErrors } from '../error/action'
import * as API from '../../../utils/Constants'
import { AsyncStorage } from 'react-native'

export const getTabCount = () => (dispatch, getState) => {

    // Headers
    const config = tokenConfig(getState)

    // console.log(API.GET_TAB_COUNT, config)

    axios
        .get(API.GET_TAB_COUNT, config)
        .then((res) => {
            // console.log(res.data)
            dispatch({
                type: GET_COUNT,
                payload: res.data.data.total_count,
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
            }
            console.log(err)
        })
}

export const deductTabCount = (countToLess) => {
    return {
        type: DEDUCT_COUNT,
        payload: countToLess
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
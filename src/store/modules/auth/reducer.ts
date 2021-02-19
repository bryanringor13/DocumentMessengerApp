import {
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    RESTORE_TOKEN,
    LOGOUT_SUCCESS,
    USER_PROFILE,
    CLEAR_PROFILE,
    INVALID_USER,
    UPDATE_PASSWORD,
    VERIFY_PASSWORD,
    CLEAR_VERIFY_PASSWORD,
    LOGIN_FAIL,
    CLEAR_NEW_PASSWORD_DATA,
    DONE_LOADING,
    CONNECTION_STATUS, CONNECTION_CHANGED
} from './types';
import { AsyncStorage } from 'react-native';

interface AuthState {
    token: String;
    userId: String;
    isAuthenticated: boolean;
    isLoading: boolean;
    user: Object;
    currentPassword: String;
    verifyPassData: Object;
    newPasswordData: Object;
    connection: {
        type: String,
        status: boolean,
        haveChanged: boolean
    };
}

const initialState: AuthState = {
    userId: '',
    token: '',
    isAuthenticated: false,
    isLoading: false,
    user: {},
    currentPassword: '',
    verifyPassData: {},
    newPasswordData: {},
    connection: {
        type: '',
        status: true,
        haveChanged: false
    },
};

export default function authReducer(state = initialState, action: any): AuthState {
    switch (action.type) {
        case CONNECTION_STATUS:
            // console.log('CONNECTION_STATUS', action.payload)
            return {
                ...state,
                connection: {
                    type: action.payload.type,
                    status: action.payload.status,
                    haveChanged: action.payload.haveChanged
                }
            }
        case CONNECTION_CHANGED:
            // console.log('CONNECTION_CHANGED', action.payload)
            return {
                ...state,
                connection: {
                    ...state.connection,
                    haveChanged: action.payload
                }
            }
        case LOGIN_SUCCESS:
            // console.log('LOGIN_SUCCESS', action.payload.token)
            return {
                ...state,
                userId: action.payload.userId,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload.data,
                currentPassword: action.payload.password
            }
        case RESTORE_TOKEN:
            // console.log('RESTORE_TOKEN', action.payload)
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: action.payload.auth,
                isLoading: false,
            }
        case USER_PROFILE:
            // console.log('USER_PROFILE', action.payload)
            return {
                ...state,
                user: action.payload,
                isLoading: false,
            }
        case CLEAR_PROFILE:
            console.log('CLEAR_PROFILE')
            return {
                ...state,
                user: {},
                isLoading: false,
            }
        case VERIFY_PASSWORD:
            // console.log('VERIFY_PASSWORD', action.payload)
            return {
                ...state,
                verifyPassData: action.payload,
                isLoading: false,
            }
        case CLEAR_VERIFY_PASSWORD:
            console.log('CLEAR_VERIFY_PASSWORD')
            return {
                ...state,
                verifyPassData: {},
                isLoading: false,
            }
        case CLEAR_NEW_PASSWORD_DATA:
            console.log('CLEAR_NEW_PASSWORD_DATA')
            return {
                ...state,
                newPasswordData: {},
                isLoading: false,
            }
        case UPDATE_PASSWORD:
            // console.log('UPDATE_PASSWORD', action.payload)
            return {
                ...state,
                newPasswordData: action.payload,
                isLoading: false,
            }
        case LOGIN_FAIL:
            console.log('LOGIN_FAIL')
            return {
                ...state,
                isLoading: false,
            }
        case LOGOUT_SUCCESS:
        case INVALID_USER:
        case AUTH_ERROR: {
            console.log('LOGOUT_SUCCESS')
            AsyncStorage.clear();
            return {
                ...state,
                token: '',
                isAuthenticated: false,
                isLoading: false,
                user: {},
            }
        }
        case USER_LOADING: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case DONE_LOADING: {
            return {
                ...state,
                isLoading: false,
            }
        }
        default:
            return state;
    }
}
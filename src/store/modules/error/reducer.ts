import {
  GET_ERRORS,
  CLEAR_ERRORS,
} from './types';
import { AsyncStorage } from 'react-native';

interface ErrorState {
  msg: [];
  status: Number;
  id: String;
}

const initialState: ErrorState = {
  msg: [],
  status: 0,
  id: '',
}

export default function errorReducer(state = initialState, action: any): ErrorState {
  switch (action.type) {
    case GET_ERRORS:
      console.log('GET_ERRORS', action)
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id,
      }
    case CLEAR_ERRORS:
      console.log('CLEAR_ERRORS', action)
      return {
        msg: [],
        status: 0,
        id: '',
      }
    default:
      return state
  }
}
import {
    GET_COUNT,
    DEDUCT_COUNT,
} from './types';
import { AsyncStorage } from 'react-native';

interface TabCountState {
    for_acceptance: Number;
    in_transit: Number;
}

const initialState: TabCountState = {
    for_acceptance: 0,
    in_transit: 0,
}

export default function countTabsReducer(state = initialState, action: any): TabCountState {
    switch (action.type) {
        case GET_COUNT:
            console.log('GET_COUNT', action.payload)
            return {
                for_acceptance: action.payload.for_acceptance,
                in_transit: action.payload.in_transit,
            }
        case DEDUCT_COUNT:
            console.log('DEDUCT_COUNT', action.payload)
            return {
                ...state,
                for_acceptance: (state.for_acceptance - action.payload),
            }
        default:
            return state
    }
}
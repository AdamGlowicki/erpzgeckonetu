import {TURN_OFF_ALERT, TURN_ON_ALERT} from "./type";

const initState = {}

const alertReducer = (state = initState, {type, payload}) => {
    switch (type) {
        case TURN_ON_ALERT:
            return {...state, scan: {...payload}}
        case TURN_OFF_ALERT:
            return {...state, scan: {time: 0, start: false, place: ''}}
        default:
            return state;
    }
}

export default alertReducer;

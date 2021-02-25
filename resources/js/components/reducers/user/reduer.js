import {GET_ALL_USERS, GET_LOGGED_USER} from "./type";

const INITIAL_STATE = {
    users: [],
    user: ''
}

const userReducer = (state = INITIAL_STATE, {type, payload}) => {
    switch (type) {
        case GET_LOGGED_USER:
            return {...state, user: payload.data}
        case GET_ALL_USERS:
            return {...state, users: [...payload]}
        default:
            return state;

    }
}

export default userReducer;

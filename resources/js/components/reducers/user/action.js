import {GET_ALL_USERS, GET_LOGGED_USER} from "./type";

export const getLoggedUserToUserStore = payload => ({
    type: GET_LOGGED_USER, payload
})

export const putAllUsersToStore = payload => ({
    type: GET_ALL_USERS, payload
})

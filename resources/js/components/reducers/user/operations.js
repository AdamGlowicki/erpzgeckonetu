import {getData} from "../../common/apiMethods/apiMethods";
import {getLoggedUserToUserStore, putAllUsersToStore} from "./action";

export const getLoggedUserOperation = (cookies) => (
    async (dispatch) => {
        const result = await getData(`/loggedUser/${cookies.userId}`, cookies)

        dispatch(getLoggedUserToUserStore(result))
    }
)

export const getAllUsers = (cookies) => (
    async dispatch => {
        const result = await getData('/user/all', cookies)

        dispatch(putAllUsersToStore(result.data))
    }
)

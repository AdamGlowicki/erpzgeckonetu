import {getData} from "../../../common/apiMethods/apiMethods";
import {putDrawersToStore, putInvestmentToStore} from "./actions";

export const fetchDrawers = (cookies) => (
    async (dispatch) => {
        const drawers = await getData('/drawers/', cookies)
        dispatch(putDrawersToStore(drawers.data))
    }
)

export const fetchInvestment = cookies => (
    async (dispatch) => {
        const result = await getData('/investment/all', cookies);
        dispatch(putInvestmentToStore(result.data))
    }
)

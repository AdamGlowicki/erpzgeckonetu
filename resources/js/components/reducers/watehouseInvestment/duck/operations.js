import {getData} from "../../../common/apiMethods/apiMethods";
import {addWarehouseInvestment} from "./actions";

export const getAllWarehouseInvestments = (cookies) => (
    async (dispatch) => {
        const investments = await getData('/investment/all', cookies)

        dispatch(addWarehouseInvestment(investments.data))
    }
)

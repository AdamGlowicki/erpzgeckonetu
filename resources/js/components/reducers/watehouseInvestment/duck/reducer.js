import {
    CReATE_WAREHOUSE_INVESTMENT_WAREHOUSE,
    GET_INVESTMENTS_WAREHOUSE,
    GET_UNITS_WAREHOUSE,
    SAVE_CAR_WAREHOUSE,
    SAVE_WAREHOUSE_WAREHOUSE
} from "./types";

const INITIAL_STATE = {
    warehouseInvestment: [],
    investments: [],
    warehouses: [],
}

const warehouseReducer = (state = INITIAL_STATE, {type, payload}) => {
    switch (type) {
        case SAVE_CAR_WAREHOUSE:
            return {...state, cars: payload}
        case SAVE_WAREHOUSE_WAREHOUSE:
            return {...state, warehouses: payload}
        case GET_UNITS_WAREHOUSE:
            return {...state, units: payload}
        case GET_INVESTMENTS_WAREHOUSE:
            return {...state, investments: payload}
        case CReATE_WAREHOUSE_INVESTMENT_WAREHOUSE:
            return {...state, investments: payload}
        default:
            return state;
    }
}

export default warehouseReducer;

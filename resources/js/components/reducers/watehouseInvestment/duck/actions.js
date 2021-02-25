import {
    ADD_ITEM_TO_WAREHOUSE_WAREHOUSE,
    CReATE_WAREHOUSE_INVESTMENT_WAREHOUSE,
    GET_INVESTMENTS_WAREHOUSE
} from "./types";

export const addItemToWarehouse = (payload) => ({
    type: ADD_ITEM_TO_WAREHOUSE_WAREHOUSE, payload
})

export const addWarehouseInvestment = payload => ({
    type: CReATE_WAREHOUSE_INVESTMENT_WAREHOUSE, payload
})

export const addWarehouseInvestments = payload => ({
    type: GET_INVESTMENTS_WAREHOUSE, payload
})

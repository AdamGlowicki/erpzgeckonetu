import {CLOSE_MODAL, FETCH_DRAWERS, UPDATE_MINI_NOTE, UPDATE_NAME} from "./reduxType";
import {GET_INVESTMENTS_WAREHOUSE} from "../../watehouseInvestment/duck/types";

export const putDrawersToStore = payload => ({
    type: FETCH_DRAWERS,
    payload,
})

export const putInvestmentToStore = payload => ({
    type: GET_INVESTMENTS_WAREHOUSE,
    payload
});

export const updateNameStore = (data) => ({
    type: UPDATE_NAME,
    payload: data
});

export const updateMiniNoteStore = (data) => ({
    type: UPDATE_MINI_NOTE,
    payload: data
});

import {Graph} from "./type";
import {basicElements} from "../../../enums/basicElement";
import {changeHandleInReducer} from "./methods";

const initialState = {
    graph: [],
    template: [...basicElements],
    handle: null,
    permissions:[],
}

const graphReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case Graph.FETCH:
            return {...state, graph: [...payload]};
        case Graph.ADD_ELEMENT:
            return {...state, graph: [...state.graph, ...payload]}
        case Graph.FETCH_TEMPLATE:
            return {...state, template: [...basicElements, ...payload]}
        case Graph.ADD_HANDLE:
            return {...state, handle: payload}
        case Graph.CHANGE_HANDLE:
            return changeHandleInReducer(state, payload)
        case Graph.FETCH_GRAPH_PERMISSIONS:
            return {...state, permissions: payload}
        default:
            return {...state}
    }
}

export default graphReducer;

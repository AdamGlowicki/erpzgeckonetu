import {Graph} from "./type";

export const addElement = payload => ({
    type: Graph.ADD_ELEMENT,
    payload
})

export const putTemplateToReducer = payload => ({
    type: Graph.FETCH_TEMPLATE,
    payload
})

export const putEdgesToReducer = payload => ({
    type: Graph.FETCH_EDGES,
    payload,
})

export const addHandleAction = payload => ({
    type: Graph.ADD_HANDLE,
    payload
})
export const putGraphPermissionsToReducer = payload => ({
    type: Graph.FETCH_GRAPH_PERMISSIONS,
    payload,
})


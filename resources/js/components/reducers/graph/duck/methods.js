export const addHandleToReducer = (state, payload) => ({
    ...state,
    graph: state.graph.map(item => {
        return item.id === payload.id ? {
            ...item,
            data: {
                ...item.data,
                handles: [...item.data.handles, {position: payload.position, type: payload.type, id: payload.handleId, elementId: 33}]
            }
        } : {...item}
    })
})

export const changeHandleInReducer = (state, payload) => ({
    ...state,
    graph: state.graph.map(item => {
        return item.id === payload.id ? {
            ...item,
            data: {
                ...item.data,
                handles: [...item.data.handles.map(item => {
                    return item.id === payload.id ? {
                        ...item,
                        type: payload.type
                    } : {...item}
                })],
            }
        } : {...item}
    })
})

// const newElements = elements.map(item => {
//     return item.id === nodeid ? {
//         ...item,
//         data: {
//             ...item.data,
//             handles: [...item.data.handles, {position: handlepos, type: 'source', id: handleid, elementId: nodeid}]
//         }
//     } : {...item}
// })

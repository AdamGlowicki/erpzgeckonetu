import {getData} from "../../../common/apiMethods/apiMethods";
import {Graph} from "./type";
import {putGraphPermissionsToReducer, putTemplateToReducer} from "./actions";

export const fetchGraph = (cookies) => (
    async (dispatch) => {
        try {
            const graph = await getData('/graph', cookies)
            const edges = await getData('/edges', cookies)
            const normalisedList = mapDataFromLaravelToNormalLanguage(graph.data)
            const normalisedEdges = mapEdges(edges.data)

            const mergedList = connectNodeWithEdges(normalisedList, normalisedEdges)

            dispatch({type: Graph.FETCH, payload: [...mergedList]})
        } catch (e) {
            console.log(e)
        }
    }
)

export const fetchGraphTemplate = cookies => (
    async (dispatch) => {
        try {
            const template = await getData('/singleElements', cookies)
            dispatch(putTemplateToReducer(template.data))
        } catch (e) {

        }
    }
)

export const fetchGraphPermissions = cookies => (
    async dispatch => {
        try {
            const result = await getData('/graphPermission/all', cookies)
            dispatch(putGraphPermissionsToReducer(result.data))
        } catch (e) {}
    }
)

const mapEdges = (array) => (
    [...array.map(graph => {
        return {
            id: graph.id,
            edges: graph.edges.map(item => ({
                id: item.edgeId,
                edgeId: item.id,
                source: item.source,
                sourceHandle: item.sourceHandle,
                target: item.target,
                targetHandle: item.targetHandle,
                type: 'custom',
                arrowHeadType: 'arrowclosed',
            }))
        }
    })]
)

const mapDataFromLaravelToNormalLanguage = (array) => (
    [...array.map(graph => {
        return {
            id: graph.id,
            name: graph.name,
            nodes: graph.nodes.map(node => {
                return {
                    id: node.id.toString(),
                    type: node.type,
                    data: {
                        label: node.nodes_data.label,
                        style: {
                            ...node.nodes_data.styles,
                        },
                        handles: [...node.handles.map(item => ({position: item.position, type: item.type, id: item.handleId, elementId: item.id}))],
                        positionId: node.positions.id,
                    },
                    position: {x: node.positions.x, y: node.positions.y,},
                }
            })
        }
    })]
)

const connectNodeWithEdges = (nodes, edges) => (
    nodes.map(node => {
        const edge = edges.find(item => item.id === node.id);
        return ({...node, nodes: [...node.nodes, ...edge.edges]})
    })
)



import React, {useState, useEffect, useCallback, Fragment,} from 'react';
import ReactFlow, {
    removeElements,
    addEdge,
    Controls,
    Background, MiniMap,
} from 'react-flow-renderer';
import Square from "../customBlocks/Square";
import GraphControls from "../graphControls/GraphControls";
import GraphExampleElements from "../graphExampleElements/GraphExampleElements";
import {useDispatch, useSelector} from "react-redux";
import styled from 'styled-components';
import {deleteData, deleteDataByIds, patchData, postData} from "../../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {fetchGraph} from "../../../../reducers/graph/duck/operations";
import PermissionController from "../permissionController/PermissionController";
import {useHistory, useParams} from "react-router";
import Edge from "../edge/Edge";
import {userPermissions, adminPermission} from "../../../../common/utils";

const snapGrid = [20, 20];
const nodeTypes = {
    square: Square,
};

const edgeTypes = {
    custom: Edge,
};

const StyledWrapper = styled.div`
  box-shadow: -10px -10px 40px -20px rgba(0,0,0,0.4);
  width: 100%;
  height: 90%;
`

const initialStyle = {
    width: 0,
    height: 0,
    backgroundColor: 'yellowgreen',
    radius: '0',
    borderSize: 0,
    borderType: 'solid',
    borderColor: 'yellowgreen',
    fontSize: 0,
    fontWeight: 0,
    color: 'yellowgreen',
    rotate: 0,
}

const Graph = () => {
    const [elements, setElements] = useState([]);
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [singleElement, setSingleElement] = useState({data: {label: '', style: initialStyle}});
    const [open, setOpen] = useState(false);
    const [style, setStyle] = useState(null);
    const [label, setStateLabel] = useState(null);
    const [loggedUser, setLoggedUser] = useState('');
    const [openPermission, setOpenPermission] = useState(false);

    const graph = useSelector(state => state.graph.graph)
    const loggedUserRedux = useSelector(state => state.user.user)
    const permissionUsers = useSelector(state => state.graph.permissions)
    const usersRedux = useSelector(state => state.user.users)

    const dispatch = useDispatch();

    const history = useHistory();

    const {id: paramId} = useParams();

    const [cookies,] = useCookies();

    useEffect(() => {
        if (loggedUserRedux) setLoggedUser(loggedUserRedux);
    }, [loggedUserRedux])


    const onElementClick = (event, element) => {
        if (element.position) {
            setSelectedElementId(element.id);
            setSingleElement(element);
        }
    }

    useEffect(() => {
        if (graph.length && paramId) {
            const element = graph.find(element => element.id === parseInt(paramId))
            if (element) {
                setElements(element.nodes);
            } else {
                history.push('/react/404')
            }
        }
    }, [graph, paramId]);


    const onElementsRemove = useCallback(
        async (elementsToRemove) => {
            const edgeIds = elementsToRemove
                .filter(element => element.source)
                .map(element => element.edgeId)
            const nodeId = elementsToRemove
                .filter(element => element.type)
                .map(element => element.id)[0]

            const idFromGeneratedId = elements.filter(item => item.id === elementsToRemove[0].id)[0].edgeId
            setElements((els) => removeElements(elementsToRemove, els))
            const ifOnlyEdge = () => (
                !edgeIds[0] && idFromGeneratedId && nodeId
            )

            const ifOnlyNode = () => (
                !edgeIds.length && nodeId && !idFromGeneratedId
            )

            try {
                if (ifOnlyEdge()) {
                    await deleteDataByIds('/edge/deleteByIds', cookies, [idFromGeneratedId])
                } else if (ifOnlyNode()) {
                    await deleteData(`/graph/delete/${parseInt(nodeId)}`, cookies)
                } else {
                    await deleteDataByIds('/edge/deleteByIds', cookies, edgeIds)
                    await deleteData(`/graph/delete/${parseInt(nodeId)}`, cookies)
                }
            } catch (e) {
                console.log(e)
            }
        }, [elements]
    );


    const createIdByParams = param => (
        `reactflow__edge-${param.source}${param.sourceHandle}-${param.target}${param.targetHandle}`
    )


    const onConnect = useCallback(
        async (params) => {
            try {
                await postData('/edges/create', {
                    ...params,
                    edgeId: createIdByParams(params),
                    graph_id: paramId
                }, cookies)
                dispatch(fetchGraph(cookies))
                setElements((els) =>
                    addEdge({...params, animated: true, style: {stroke: '#000', width: '10px'}}, els)
                )
            } catch (e) {
            }
        },
    );


    const handleStyle = async (e) => {
        const {name, value} = e.target;
        const {data: {style: {id}}} = singleElement;
        setSingleElement({
            ...singleElement,
            data: {
                ...singleElement.data,
                style: {
                    ...singleElement.data.style,
                    [name]: value,
                }
            }
        })
        setStyle({[name]: value})
    }

    useEffect(() => {
        const {data: {style: {id}}} = singleElement;
        const handler = setTimeout(async () => {
            try {
                style && await patchData(`/style/update/${id}`, {...style}, cookies)
            } catch (e) {
                console.log(e)
            }
        }, 1000)

        return () => {
            clearTimeout(handler)
        }
    }, [style])

    const setLabel = e => {
        const {value} = e.target;
        setSingleElement({
            ...singleElement,
            data: {
                ...singleElement.data,
                label: value
            }
        })
        setStateLabel(value)
    }

    useEffect(() => {
        const handler = setTimeout(async () => {
            try {
                label && await patchData(`nodeData/updateLabel/${selectedElementId}`, {label}, cookies)
            } catch (e) {
                console.log()
            }
        }, 1000)

        return () => {
            clearTimeout(handler)
        }
    }, [label])


    useEffect(() => {
        if (elements.length) {
            setElements(elements.map(element => {
                return parseInt(element.id) === parseInt(selectedElementId) ? {
                    ...element,
                    id: element.id.toString(),
                    data: {
                        ...element.data,
                        label: singleElement.data.label
                    }
                } : {...element}
            }))
        }
    }, [singleElement.data.label])

    useEffect(() => {
        if (elements.length) {
            const newElements = elements.map(element => {
                return parseInt(element.id) === parseInt(selectedElementId) ? {
                    ...element,
                    id: element.id.toString(),
                    data: {
                        ...element.data,
                        style: {
                            ...singleElement.data.style,
                        }
                    }
                } : {...element}
            })
            setElements([...newElements])
        }
    }, [singleElement.data.style])

    const cloneElement = async () => {
        const position = {x: singleElement.position.x + 50, y: singleElement.position.y + 50}
        const newElement = {
            graph_id: paramId,
            type: singleElement.type,
            data: {
                label: singleElement.data.label,
                style: singleElement.data.style,
            },
            position,
        }
        try {
            const result = await postData('/graph/add', newElement, cookies);
            dispatch(fetchGraph(cookies))
        } catch (e) {
            console.log(e)
        }
    }

    const onNodeDragStop = useCallback(async (event, node) => {
        try {
            await patchData(`/position/update/${node.data.positionId}`, {
                x: node.position.x,
                y: node.position.y
            }, cookies)
        } catch (e) {
        }
    });

    const onLoad = useCallback(
        (rfi) => {
            if (!reactflowInstance) {
                setReactflowInstance(rfi);
            }
        },
        [reactflowInstance, paramId]
    );

    useEffect(() => {
        if (reactflowInstance && elements.length > 0) {
            reactflowInstance.fitView();
        }
    }, [reactflowInstance, elements.length]);

    const designerPermission = userPermissions(permissionUsers, usersRedux, loggedUser)

    const adminPermissions = adminPermission(loggedUser)

    return (
        <StyledWrapper>
            <ReactFlow
                onLoad={onLoad}
                elements={elements}
                nodesDraggable={designerPermission}
                onElementClick={designerPermission ? onElementClick : () => null}
                onElementsRemove={designerPermission ? onElementsRemove : () => null}
                onConnect={designerPermission ? onConnect : () => null}
                onNodeDragStop={designerPermission ? onNodeDragStop : () => null}
                style={{background: '#fff'}}
                nodeTypes={nodeTypes}
                snapToGrid={false}
                snapGrid={snapGrid}
                edgeTypes={edgeTypes}
            >
                <Background color={'yellowgreen'} gep={16}/>

                <Controls
                    showInteractive={designerPermission}
                />

                <MiniMap
                    nodeStrokeColor={(n) => {
                        return 'yellowgreen'
                    }}
                    nodeColor={(n) => {
                        return '#fff';
                    }}
                />

                {designerPermission ? (
                    <Fragment>
                        <GraphControls
                            style={singleElement.data.style}
                            handleStyle={handleStyle}
                            cloneElement={cloneElement}
                            elementId={selectedElementId}
                            open={open}
                            setOpen={setOpen}
                            label={singleElement.data.label}
                            setLabel={setLabel}
                            openPermission={openPermission}
                            setOpenPermission={setOpenPermission}
                            adminPermission={adminPermissions}
                        />

                        <GraphExampleElements open={open}/>

                        <PermissionController open={openPermission}/>
                    </Fragment>
                ) : null}
            </ReactFlow>
        </StyledWrapper>

    );
};
export default Graph;

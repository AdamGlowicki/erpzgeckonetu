import React, {useEffect} from 'react';
import {Route, Switch} from "react-router";
import GraphStructure from "../../organism/graphStructure/GraphStructure";
import {useCookies} from "react-cookie";
import {useDispatch} from "react-redux";
import {fetchGraph, fetchGraphPermissions, fetchGraphTemplate} from "../../../../reducers/graph/duck/operations";


const GraphStructureRouter = () => {
    const [cookies,] = useCookies();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGraph(cookies))
        dispatch(fetchGraphTemplate(cookies))
        dispatch(fetchGraphPermissions(cookies))
    }, [])

    return (
        <Switch>
            <Route exact path='/react/graph' component={GraphStructure}/>
            <Route exact path='/react/graph/:id' component={GraphStructure}/>
        </Switch>
    );
};

export default GraphStructureRouter;

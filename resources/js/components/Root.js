import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import Investments from './components/organism/Investments';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import styled, {css} from "styled-components";
import {Breakpoints} from "./enums/sizing/breakpionts";
import {Route, Switch,} from 'react-router-dom';
import {Redirect} from 'react-router';
import NoMatch from "./components/molecules/noMatch/NoMatch";
import MainTheme from "./components/theme/MainTheme";
import {getAllUsers, getLoggedUserOperation} from "./reducers/user/operations";
import {useCookies} from "react-cookie";
import CarServiceRouter from "./components/carService/molecules/carServiceRouter/CarServiceRouter";
import GraphStructureRouter from "./components/graph/molecules/graphStructureRouter/GraphStructureRouter";

const StyledWrapper = styled.div`
  ${({matches}) => (
    matches && css`
        display: flex;
        justify-content: center;
      `
)}
`
const Root = () => {
    const matches = useMediaQuery(`(max-width:${Breakpoints.MD})`);

    const dispatch = useDispatch();
    const [cookies,] = useCookies();

    useEffect(() => {
        dispatch(getAllUsers(cookies))
        dispatch(getLoggedUserOperation(cookies))
    }, [])

    return (
        <MainTheme>
            <StyledWrapper matches={matches}>
                <Switch>
                    <Route path='/react/graph' component={GraphStructureRouter}/>
                    <Route path='/react/invest' component={Investments}/>
                    <Route path={'/react/carService'} component={CarServiceRouter}/>

                    <Route path='/react/404' component={NoMatch}/>
                    <Route path='*' component={() => <Redirect from='*' to='/react/404'/>}/>
                </Switch>
            </StyledWrapper>
        </MainTheme>
    );
};


export default Root;

import React, {Fragment, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AddTaskButton from '../molecules/addInvestmentButton/AddInvestmentButton';
import styled from 'styled-components';
import SpringModal from './modal/Modal';
import GenerateProjects from "../molecules/genetateProjects/GeneratePtojects";
import {isAllow, mapJsonToMyVariables} from "../../common/globalMethods";
import {AppPerm} from "../../enums/permissions/permissions";
import ClientAgreement from "../molecules/clientAgreements/ClientAgreement";
import GroupAlerts from "../molecules/droupAlerts/GroupAlerts";
import {Redirect, Switch, useLocation} from "react-router";
import {Route} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import {fetchDrawers} from "../../reducers/investments/duck/operations";
import {fetchAgreements} from "../../reducers/agreement/duck/operations";
import {getData} from "../../common/apiMethods/apiMethods";
import {
    GET_INVESTMENTS_WAREHOUSE,
    GET_UNITS_WAREHOUSE,
    SAVE_CAR_WAREHOUSE,
    SAVE_WAREHOUSE_WAREHOUSE
} from "../../reducers/watehouseInvestment/duck/types";
import {GET_DATA, SET_PERMISSIONS} from "../../reducers/investments/duck/reduxType";
import {useCookies} from "react-cookie";

const StyledDisplay = styled.div`
  display: ${({display}) => display ? 'block' : 'none'};
`

const Investments = () => {
    const dispatch = useDispatch();
    const [cookies,] = useCookies();

    const asyncGetWarehousesFromDb = async () => {
        try {
            const result = await getData('/warehouse/all', cookies)
            dispatch({type: SAVE_WAREHOUSE_WAREHOUSE, payload: result.data})
        } catch (e) {

        }
    }

    const asyncGetCars = async () => {
        try {
            const result = await getData('/car/all', cookies);
            dispatch({type: SAVE_CAR_WAREHOUSE, payload: result.data})
        } catch (e) {
            console.log(e)
        }
    }

    const asyncGetData = async () => {
        try {
            const result = await getData('/invest', cookies)
            dispatch({type: GET_DATA, payload: {data: mapJsonToMyVariables(result.data)}})
        } catch (e) {
            console.log(e)
        }
    }

    const asyncGetUnits = async () => {
        try {
            const result = await getData('/unit/all', cookies);
            dispatch({type: GET_UNITS_WAREHOUSE, payload: result.data})
        } catch (e) {

        }
    }

    const asyncGetInvestments = async () => {
        try {
            const result = await getData('/investment/all', cookies);
            dispatch({type: GET_INVESTMENTS_WAREHOUSE, payload: result.data})
        } catch (e) {

        }
    }

    const asyncGetPermissions = async () => {
        try {
            const permission = await getData('/profile/permissions', cookies)
            dispatch({type: SET_PERMISSIONS, payload: permission.data})
        } catch (e) {
        }
    }

    useEffect(() => {
        asyncGetData()
        asyncGetPermissions()
        asyncGetCars()
        asyncGetWarehousesFromDb()
        asyncGetUnits()
        asyncGetInvestments()
        dispatch(fetchDrawers(cookies))
        dispatch(fetchAgreements(cookies));
    }, [])

    const getIntervalData = async () => {
        await asyncGetData()
        dispatch(fetchAgreements(cookies));
    }

    setInterval(getIntervalData, 50000);

    const permission = useSelector(state => state.investments.permissions);
    const investments = useSelector(state => state.investments.mainStage)

    const location = useLocation();

    const allowGetInvest = permission && isAllow(permission, [AppPerm.SHOW_INVESTS]);
    const allowAddInvest = permission && isAllow(permission, [AppPerm.ADD_INVEST]);
    const allowAgreements = permission && isAllow(permission, AppPerm.AGREEMENT_OPERATION)
    return (
        <Fragment>
            {investments.length ? (
                <StyledDisplay display={investments.length}>
                    {allowGetInvest && <GenerateProjects/>}
                    {allowAddInvest && <AddTaskButton/>}
                    {allowAgreements && (<ClientAgreement/>)}
                    <GroupAlerts/>
                    <Switch location={location}>
                        <Route exact path='/react/invest/'/>
                        <Route exact path='/react/invest/task/:stageId/:taskId' component={SpringModal}/>
                        <Route exact path='/react/invest/task/:stageId/:taskId/:folderId' component={SpringModal}/>

                        <Redirect to={{state: {error: true}}}/>
                    </Switch>
                </StyledDisplay>
            ) : (
                <CircularProgress style={{color: 'yellowgreen'}}/>
            )}
        </Fragment>

    )
};

export default Investments;

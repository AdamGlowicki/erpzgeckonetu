import React, {useEffect, useState} from 'react';
import {useCookies} from "react-cookie";
import {useDispatch, useSelector} from "react-redux";
import {fetchCars, fetchFleetCars} from "../../../../reducers/car";
import {Route, Switch} from "react-router";
import CarService from "../../organisms/CarService";
import CarDetail from "../carDetail/CarDetail";
import {getData, handleErrorApi} from "../../../../common/apiMethods/apiMethods";
import {adminPermission} from "../../../../common/utils";
import Alert from "../../../globalComponents/alert/Alert";


export const CarServiceDataContext = React.createContext(null);

const CarServiceRouter = () => {
    const [alerts, setAlerts] = useState([]);
    const [cookies,] = useCookies()
    const dispatch = useDispatch();
    const loggedUser = useSelector(state => state.user.user)
    const [permissions, setPermissions] = useState([]);
    const [permission, setPermission] = useState({})
    const [alert, setAlert] = useState({});

    const getAlerts = handleErrorApi(async (cookies) => {
        const data = await getData('/alertsCars', cookies)
        setAlerts(data.data)
    })

    const getPermissions = handleErrorApi(async () => {
        const data = await getData('carPermissions', cookies)
        setPermissions(data.data)
    })

    useEffect(() => {
        const loggedUserPerm = permissions.find(perm => perm.user_id === parseInt(cookies.userId))
        loggedUserPerm && setPermission({...loggedUserPerm})
    }, [permissions])

    useEffect(() => {
        dispatch(fetchCars(cookies))
        dispatch(fetchFleetCars(cookies))
        getAlerts(cookies)
        getPermissions()
    }, [])

    return (
        <CarServiceDataContext.Provider value={{
            alerts,
            adminPermission: adminPermission(loggedUser),
            permission,
            getAlerts,
            permissions,
            setPermissions,
            alert,
            setAlert,
            loggedUser,
        }}>
            <Switch>
                <Route exact path='/react/carService/' component={CarService}/>
                <Route exact path='/react/carService/:id' component={CarDetail}/>
            </Switch>

            <Alert context={CarServiceDataContext} ms={500}/>
        </CarServiceDataContext.Provider>
    );
};

export default CarServiceRouter;

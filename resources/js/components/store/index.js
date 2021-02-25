import { configureStore } from '@reduxjs/toolkit';
import investmentReducer from "../reducers/investments/duck";
import warehouseReducer from "../reducers/watehouseInvestment/duck";
import userReducer from "../reducers/user";
import alertReducer from "../reducers/alert/duck";
import agreementReducer from "../reducers/agreement/duck";
import graphReducer from "../reducers/graph/duck";
import cars from '../reducers/car'

import thunk from 'redux-thunk'

export default configureStore({
    reducer: {
        investments: investmentReducer,
        warehouse: warehouseReducer,
        user: userReducer,
        alerts: alertReducer,
        agreements: agreementReducer,
        graph: graphReducer,
        cars: cars,
    },
    middleware: [thunk],
});

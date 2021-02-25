import React, {Fragment} from 'react';
import MyCircularProgress from "../myCircularProgress/MyCircularProgress";
import SuccessAlert from "../alerts/SuccessAlert";
import FailAlert from "../alerts/FailAlert";
import CountdownAlert from "../alerts/CountdownAlert";

const GroupAlerts = () => {
    return (
        <Fragment>
            <MyCircularProgress/>
            <SuccessAlert/>
            <FailAlert/>
            <CountdownAlert/>
        </Fragment>
    );
};

export default GroupAlerts;

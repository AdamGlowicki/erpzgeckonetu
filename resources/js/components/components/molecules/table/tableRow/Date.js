import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {useCookies} from "react-cookie";
import {getToday} from "../../../../common/globalMethods";
import {IS_ERROR, IS_LOADING, SET_DATE_IN_TABLE} from "../../../../reducers/investments/duck/reduxType";
import {patchData} from "../../../../common/apiMethods/apiMethods";
import TableCell from "@material-ui/core/TableCell";
import Input from "@material-ui/core/Input";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        border: 0,
        color: 'black',
        height: '300px',
        padding: '0 30px',

    },
    animated: {
        fontSize: '10px',
        width: '84%'
    },
    smallSize: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        background: ({background}) => background,
    }
}));

const Date = ({id, stageId, taskId, rowColor, date, dataKey, actionType}) => {
    const [stateDate, setStateDate] = useState('');
    const dispatch = useDispatch()
    const classes = useStyles({background: rowColor});

    const [cookies, setCookie] = useCookies(['name'])

    useEffect(() => {
        !date && (date = getToday());
        setStateDate(date);
    }, [date])

    const handleSetDate = (e) => {
        const {value} = e.target;
        setStateDate(value)
    };

    useEffect(() => {
        let handler;
        if (date !== stateDate) {
            handler = setTimeout(asyncSetSendDate, 500);
        }
        return () => {
            clearTimeout(handler);
        }
    }, [stateDate]);

    console.log()
    const asyncSetSendDate = async () => {
        dispatch({type: IS_LOADING, payload: true});
        try {
            await patchData(`/body/${id}`, {[dataKey]: stateDate}, cookies);
            dispatch({type: SET_DATE_IN_TABLE, payload: {value: stateDate, type: actionType, rowId: id, stageId, taskId}})
        } catch (e) {
            dispatch({type: IS_ERROR, payload: {isError: true, errorMessage: `Nie udało sie zmienić daty wysłania na ${stateDate}`}})
            setStateDate(date)
        }
        dispatch({type: IS_LOADING, payload: false});
    };

    useEffect(() => {
        let handler;
        if (date !== stateDate) {
            handler = setTimeout(asyncSetSendDate, 500);
        }
        return () => {
            clearTimeout(handler);
        }
    }, [stateDate]);

    return (
        <TableCell className={classes.smallSize}>
            <form noValidate>
                <Input
                    id="date"
                    label="Data"
                    type="date"
                    size='small'
                    value={stateDate}
                    onChange={handleSetDate}
                    className={classes.animated}
                />
            </form>
        </TableCell>
    );
};

Date.propTypes = {

};

export default Date;

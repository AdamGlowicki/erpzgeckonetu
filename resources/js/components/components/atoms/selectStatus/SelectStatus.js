import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {statusTemplate} from '../../../enums/StatusTemplate';
import {connect} from 'react-redux';
import {changeStatus} from './selectStatusService';
import {getColorByLabel, setError, setLoading} from '../../../common/globalMethods';
import {patchData} from '../../../common/apiMethods/apiMethods';
import {useCookies} from "react-cookie";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {makeStyles} from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";

const StyledWrapper = styled.div`
  grid-column: span 3 / 14;
`;

const useStyles = makeStyles((theme) => ({
    items: {
        color: 'rgb(155, 192, 0)'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        background: ({background}) => background,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const SelectStatus = ({changeStatus, id, status, stageId, setLoading, setError}) => {
    const [cookies, setCookie] = useCookies(['name'])

    const [stateStatus, setStateStatus] = useState('');

    const classes = useStyles({background: getColorByLabel(stateStatus)});

    useEffect(() => {
        setStateStatus(status);
    }, [status])

    const asyncSelectStatus = async status => {
        setLoading(true);
        try {
            const result = await patchData(`/task/${id}`, {status}, cookies);
            changeStatus(id, stageId, status);
        } catch (e) {
            setLoading(false)
            setError({isError: true, errorMessage: `Nie udało sie zmienić statusu na ${status}`})
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const {value} = e.target
        setStateStatus(value)
        asyncSelectStatus(value);
    };

    return (
        <StyledWrapper>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={stateStatus}
                    onChange={handleChange}
                >
                    {statusTemplate.map(item => (
                        <MenuItem value={item.label} className={classes.items} key={item.id}>{item.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </StyledWrapper>
    );
};

const mapStateToProps = ({investments: {modalStatus}}) => ({modalStatus});

const mapDispatchToProps = (dispatch) => ({
    changeStatus: (id, stageId, status) => dispatch(changeStatus(id, stageId, status)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectStatus);

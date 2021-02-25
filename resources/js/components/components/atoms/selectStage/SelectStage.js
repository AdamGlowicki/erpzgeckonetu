import React, {useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {connect, useSelector} from 'react-redux';
import {middleStageTemplate} from '../../../enums/StageTemplate';
import {ADD_MIDDLE_STAGE} from '../../../reducers/investments/duck/reduxType';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {setError, setLoading} from '../../../common/globalMethods';
import {postData} from "../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {chooseTemplate} from "../../../reducers/investments/duck/reduxMethod";

const addStage = payload => ({
    type: ADD_MIDDLE_STAGE,
    payload
});

const useStyles = makeStyles((theme) => ({
    items: {
        color: 'rgb(155, 192, 0)'
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
            display: 'flex',
            flexDirection: 'column',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        width: '25ch',
    },
}));

const StyledSelect = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'rgb(162,198,0)',
        },'.MuiInputLabel-formControl': {
            color: 'rgb(162,198,0)',
        },
    },
})(Select);

const SelectStage = ({stage: {level, id, country, deadline, add_date}, addMiddleStage, setLoading, setError, close, disableButton}) => {
    const [stage, setStage] = useState('');
    const classes = useStyles();

    const [cookies, setCookie] = useCookies(['name'])

    const loggedUser = useSelector(state => state.user.user.data)
    console.log(loggedUser)

    const asyncSelect = async (stage) => {
        setLoading(true);
        try {
            const result = await postData(`/invest`, {
                parent_id: id,
                level: level + 1,
                client: '',
                stage_name: stage,
                main: 0,
                country,
                deadline,
                add_date,
                adder: loggedUser,
            }, cookies);
            const tasks = await postData(`/tasks/${result.data.id}`, chooseTemplate(stage, result.data.id), cookies)
            setStage(stage);
            addMiddleStage({
                id: result.data.id,
                parent_id: id,
                level: level + 1,
                stageName: stage,
                tasks: [...tasks.data],
                client: '',
                stage_name: stage,
                main: 0,
                country,
                deadline,
                add_date,
                adder: loggedUser,
            });
            disableButton(false)
            close()
        } catch (e) {
            setLoading(false)
            setError({isError: true, errorMessage: 'Nie udało się dodać pośredniego etapu.'});
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const {value} = e.target;
        disableButton(true)
        asyncSelect(value);
    };

    return (

        <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Etap</InputLabel>
            <StyledSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={stage}
                onChange={handleChange}
            >
                {middleStageTemplate().map(item => (
                    <MenuItem value={item.value} className={classes.items} key={item.id}>{item.label}</MenuItem>
                ))}
            </StyledSelect>
        </FormControl>
    );
};

const mapDispatchToProps = dispatch => ({
    addMiddleStage: data => dispatch(addStage(data)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
});

SelectStage.defaultProps = {
    addMiddleStage: PropTypes.func,
    setError: PropTypes.func,
    setLoading: PropTypes.func,
    level: PropTypes.number,
    handleOpenAfterChoose: PropTypes.func
};

export default connect(null, mapDispatchToProps)(SelectStage);

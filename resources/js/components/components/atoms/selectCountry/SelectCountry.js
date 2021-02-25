import React, {useState} from 'react';
import {ADD_INVESTMENT} from '../../../reducers/investments/duck/reduxType';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {investmentsTemplate} from '../../../enums/InvestmentTemplate';
import {postData} from '../../../common/apiMethods/apiMethods';
import {setError, setLoading, setSuccess} from '../../../common/globalMethods';
import {useCookies} from "react-cookie/";

const addStage = payload => ({
    type: ADD_INVESTMENT,
    payload
});

const useStyles = makeStyles((theme) => ({
    items: {
      color: 'rgb(155, 192, 0)'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const SelectCountry = ({setOpen, addStage, setError, setSuccess, setLoading}) => {
    const [stage, setStage] = useState('');
    const classes = useStyles();

    const [cookies, setCookie] = useCookies(['name'])

    const asyncHandleAddInvestment = async (value) => {
        setLoading(true);
        try {
            const result = await postData('/invest', {stage_name: value, main: true}, cookies);
            setStage(value);
            setOpen(false);
            addStage({id: result.data.id, stage_name: value, files: [], parent_id: null, main: true});
            setSuccess({isSuccess: true, successMessage: `Poprawnie dodano inwestycję ${value}`})
        } catch(e) {
            setLoading(false)
            setError({isError: true, errorMessage: 'Nie udało się dodać nowej inwestycji'});
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const {value} = e.target;
        asyncHandleAddInvestment(value)
    };
    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Powiat</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={stage}
                onChange={handleChange}
            >
                {investmentsTemplate().map(item => (
                    <MenuItem value={item.value} className={classes.items} key={item.id}>{item.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const mapDispatchToProps = dispatch => ({
    addStage: (country) => dispatch(addStage(country)),
    setSuccess: data => dispatch(setSuccess(data)),
    setError: data => dispatch(setError(data)),
    setLoading: data => dispatch(setLoading(data)),
});

SelectCountry.propTypes = {
    setOpen: PropTypes.func,
    addStage: PropTypes.func,
    setSuccess: PropTypes.func,
    setError: PropTypes.func,
    setLoading: PropTypes.func
};

export default connect(null, mapDispatchToProps)(SelectCountry);

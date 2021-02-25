import React, {useState} from 'react';
import {ADD_TABLE} from '../../../reducers/investments/duck/reduxType';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {tableTemplates} from '../../../enums/table/tablesTempaltes';
import {setError, setLoading} from '../../../common/globalMethods';
import {useCookies} from "react-cookie";
import {postData} from "../../../common/apiMethods/apiMethods";

const selectTable = table => ({
    type: ADD_TABLE,
    payload: table
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


const SelectTable = ({selectTable, id, stageId, setLoading, setError}) => {
    const [table, setTable] = useState('');
    const classes = useStyles();

    const [cookies, setCookie] = useCookies(['name'])

    const asyncSelectTable = async (value) => {
        setLoading(true);
        try {
            const result = await postData(`/table`, {title: value, type: value, task_id: id}, cookies);
            selectTable({data: result.data, id, stageId})
        } catch (e) {
            setLoading(false)
            setError({isError: true, errorMessage: `Nie udało się dodać tabeli ${value}.`})
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const {value} = e.target;
        setTable(value);
        asyncSelectTable(value);
    };
    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Tabela</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={table}
                onChange={handleChange}
                className={classes.selectMenu}
            >
                {tableTemplates.map(item => (
                    <MenuItem value={item.value} className={classes.items} key={item.id}>{item.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const mapDispatchToProps = dispatch => ({
    selectTable: (table) => dispatch(selectTable(table)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
});

SelectTable.propTypes = {
    selectTable: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(SelectTable);

import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {AgreeOptions} from '../../../enums/table/agreeOptions';
import {AgreementsStatus} from '../../../enums/table/agreementsStatus';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 30
    },
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
    animated: {
        display: 'none'
    },
    selectMenu: {
        fontSize: '10px'
    }
}));


const SelectTableStatus = ({status, handleStatus}) => {
    const classes = useStyles();

    return (
        <FormControl>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                defaultValue={AgreementsStatus.UNDEFINED}
                onChange={handleStatus}
                classes={{
                    root: classes.root,
                    selectMenu: classes.selectMenu
                }}
            >
                {AgreeOptions.map(item => (
                    <MenuItem value={item.value} className={classes.items} key={item.id}>{item.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};


SelectTableStatus.propTypes = {
    selectStatus: PropTypes.func,
    rowId: PropTypes.number,
    status: PropTypes.string,
};

export default SelectTableStatus;

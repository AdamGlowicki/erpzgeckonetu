import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const StyledDate = withStyles({
    root: {
        marginLeft: '16px',
        '& label.Mui-focused': {
            color: 'rgb(162,198,0)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'rgb(162,198,0)',
        },
    },
})(TextField);

const InputDate = ({...props}) => {
    return (
        <StyledDate
            id="date"
            type="date"
            InputLabelProps={{
                shrink: true,
            }}
            {...props}
        />
    );
};

export default InputDate;

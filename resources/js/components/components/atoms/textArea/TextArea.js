import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const StyledTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'rgb(162,198,0)',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: 'rgb(162,198,0)',
            },
        },
    },
})(TextField);

const TextArea = ({...props}) => {
    return (
        <StyledTextField
            id="outlined-multiline-static"
            multiline
            variant="outlined"
            {...props}
        />
    );
};

export default TextArea;

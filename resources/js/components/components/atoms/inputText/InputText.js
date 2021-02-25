import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const StyledTextField = withStyles({
    root: {
        width: props => props.width,
        '& label.Mui-focused': {
            color: 'rgb(162,198,0)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'rgb(162,198,0)',
        },
    },
})((props) => <TextField {...props}/>);

const InputText = ({...props}) => {
    return (
        <StyledTextField
            id="standard-basic"
            {...props}
        />
    );
};

export default InputText;

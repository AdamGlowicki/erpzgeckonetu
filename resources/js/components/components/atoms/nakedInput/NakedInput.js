import React from 'react';
import Input from "@material-ui/core/Input";
import {withStyles} from "@material-ui/core/styles";

const StyledInput = withStyles({
        root: {
            width: '100%',
            margin: '0 4px',
            '&.Mui-disabled': {
                color: 'black',
                fontWeight: 'normal',
                border: 'none',
                fontSize: '14px',
            },
        },
        input: {
            '&.MuiInputBase-input': {
                textAlign: props => props.textalign,
                border: 'none',
                fontSize: 'auto',
                padding: 0,
                fontWeight: 200,
            },
            '&.MuiInputBase-input.Mui-disabled': {
                padding: 0,
                fontWeight: 400,
            },
        }
    }
)(props => <Input {...props}/>);
const NakedInput = ({...props}) => (
    <StyledInput {...props}/>
)

export default NakedInput;

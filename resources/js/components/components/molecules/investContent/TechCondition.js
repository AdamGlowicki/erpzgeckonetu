import React from 'react';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components'
import {
    withStyles,
} from '@material-ui/core/styles';

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


const StyledWrapper = styled.div.attrs({
    className: 'mt-4'
})`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

const TechCondition = ({inputsContent, handleInput}) => {

    return (
        <StyledWrapper>
            <StyledTextField
                id="outlined-multiline-static"
                label='Warunki techniczne'
                multiline
                rows={1}
                value={inputsContent.condition}
                onChange={handleInput}
                variant="outlined"
                name='condition'
            />
            <StyledDate
                id="date"
                label='Data wygaśnięcia'
                type="date"
                value={inputsContent.condition_term}
                onChange={handleInput}
                InputLabelProps={{
                    shrink: true,
                }}
                name='condition_term'
            />
        </StyledWrapper>
    );
};

export default TechCondition;

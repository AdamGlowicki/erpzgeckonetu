import React from 'react';
import styled, {css} from 'styled-components';

const StyledInput = styled.input.attrs({
    'data-testid': 'input'
})`
  border: 1px solid black;
  border-radius: 4px;
  padding: 4px;
  transition: 200ms;
  font-size: 12px;

  &:focus {
    outline: none;
    border: 2px solid yellowgreen;
  }

  ${({uppercase}) => (
    uppercase && css`
        text-transform: uppercase;
      `
)}
`

const Input = ({refData,...props}) => (
    <StyledInput
        ref={refData}
        {...props}/>
);

export default Input;

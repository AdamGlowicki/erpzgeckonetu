import React from 'react';
import styled, {css} from 'styled-components';

const StyledButton = styled.button.attrs({
    className: 'p-0 d-flex mr-2 mt-2 mb-2'
})`
  flex-direction: row;
  align-items: center;
  padding: 0;
  width: 0;
  height: 0;
  color: blue;
  font-size: 16px;
  font-weight: bold;
  background-color: transparent;
  border: none;
  ${({remove}) => (
    remove && css`
        color: darkred;
      `
)}
`;

const ButtonTemplate = ({...props}) => (
    <StyledButton {...props}></StyledButton>
);

export default ButtonTemplate;

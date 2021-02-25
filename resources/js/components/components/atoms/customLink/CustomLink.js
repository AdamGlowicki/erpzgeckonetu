import React from 'react';
import styled from 'styled-components';
import {NavLink} from 'react-router-dom';

const StyledLink = styled(NavLink)`
  width: 100%;
  text-transform: none;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
        text-transform: none;
        color: inherit;
  }
`

const CustomLink = ({children, ...props}) => (
    <StyledLink {...props}>
        {children}
    </StyledLink>
);

export default CustomLink;

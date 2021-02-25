import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div.attrs({
    className: 'mt-5'
})`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const StyledImg = styled.img`
    height: 80vh;
    object-fit: contain;
`

const NoMatch = () => {
    return (
        <StyledWrapper>
            <StyledImg src='https://geckonet.pl/pro_geckonet/img/404.png' alt='404'/>
        </StyledWrapper>
    );
};

export default NoMatch;

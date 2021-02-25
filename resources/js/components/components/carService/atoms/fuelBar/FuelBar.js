import React from 'react';
import styled, {keyframes} from 'styled-components';

const slide = keyframes`
  from {transform: scaleY(0)}
  to {transform: scaleY(1)}
`

const StyledWrapper = styled.div`
  position:relative;
  width: 10px;
  height: 30px;
  border: 1px solid yellowgreen;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  border-radius: 3px;
  overflow: hidden;
`

const Bar = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(green 10%, yellow 90%, red 100%);
`

const Level = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${props => props.fuelLevel}%;
  background-color:#fff;
  z-index: 1;
  animation: ${slide} 2s;
  transform-origin: top;
`

const FuelBar = ({fuelLevel = 70}) => {
    return (
        <StyledWrapper>
            <Bar/>
            <Level fuelLevel={100 - fuelLevel}/>
        </StyledWrapper>
    );
};

export default FuelBar;

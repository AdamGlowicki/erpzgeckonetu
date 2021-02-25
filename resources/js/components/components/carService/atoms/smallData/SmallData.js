import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`

const Title = styled.div`
  font-size: 14px;
`

const StdData = styled.div`
  font-size: 20px;
  font-weight: 600;
`

const Unit = styled.div.attrs({
    className: 'mb-1 ml-2'
})`
  font-size: 12px;
`

const UnitVelocity = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-around;
`

const SmallData = ({title, data, unit}) => {
    return (
        <StyledWrapper>
            <Title>{title}</Title>

            <UnitVelocity>
                <StdData>
                    {data}
                </StdData>
                <Unit>
                    {unit}
                </Unit>
            </UnitVelocity>
        </StyledWrapper>
    );
};

export default SmallData;

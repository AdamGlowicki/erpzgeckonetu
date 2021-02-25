import React from 'react';
import styled from 'styled-components';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import FuelBar from "../fuelBar/FuelBar";

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

const Fuel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`

const Quantity = styled.div`
  font-size: 24px;
  font-weight: 600;
`

const Unit = styled.div.attrs({
    className: 'mb-1 ml-1'
})`
  font-size: 14px;
`

const FuelLevel = ({fuelLevel}) => {
    return (
        <StyledWrapper>
            <Title>poziom paliwa</Title>

            <div className='d-flex flex-row'>
                <Fuel>
                    <LocalGasStationIcon fontSize='small'/>
                    <FuelBar fuelLevel={(fuelLevel / 60) *100}/>
                </Fuel>

                <div className='d-flex flex-row align-items-end ml-2'>
                    <Quantity>
                        {fuelLevel}
                    </Quantity>
                    <Unit>
                        L
                    </Unit>
                </div>

            </div>

        </StyledWrapper>
    );
};

export default FuelLevel;

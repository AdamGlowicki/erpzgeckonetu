import React, {useContext} from 'react';
import styled from 'styled-components';
import {CarContext} from "../carDetail/CarDetail";

const StyledWrapper = styled.div.attrs({
    className: 'p-2'
})`
  width: 100%;
`

const StyledLabelValue = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Label = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-size: 12px;
`

const Value = styled.div`
  text-align: end;
  font-size: 14px;
  font-weight: 600;
`

const Item = ({label, value}) => (
    <StyledLabelValue>
        <Label>
            {label}
        </Label>
        <Value>
            {value}
        </Value>
    </StyledLabelValue>
)

const RestData = () => {
    const {navifleetData} = useContext(CarContext);
    const {car} = navifleetData;
    const {car: {other: carControls}} = navifleetData;

    const getValueByIndex = (index, array) => (array.find(item => item.index === index).value)

    return (
        <StyledWrapper>
            <Item value={`${car.lat} || ${car.lat}`} label={'Pozycja'}/>
            <Item value={car.location} label={'Adres'}/>
            <Item value={car.mileage} label={'Przebieg'}/>
            <Item value={getValueByIndex('htvd', carControls)} label='Całkowity dystans (km)'/>
        </StyledWrapper>
    );
};

export default RestData;

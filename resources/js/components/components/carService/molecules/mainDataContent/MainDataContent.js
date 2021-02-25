import React, {useContext} from 'react';
import styled from 'styled-components';
import Velocity from "../../atoms/velocity/Velocity";
import FuelLevel from "../../atoms/fuelLevel/FuelLevel";
import SmallData from "../../atoms/smallData/SmallData";
import {CarContext} from "../carDetail/CarDetail";

const StyledWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2);
  grid-gap: 4px;
`

const Block = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

`

const MainDataContent = () => {
    const {navifleetData} = useContext(CarContext);
    const {car: {other: carControls}} = navifleetData;

    const getValueByIndex = (index , array ) => {
        const data = array.find(item => item.index === index)
        return data ? data.value : undefined
    }

    return (
        <StyledWrapper>
            <Velocity
                title='prędkość'
                unit='km/h'
                velocity={getValueByIndex('speed', carControls)}
            />

            <FuelLevel fuelLevel={getValueByIndex('f', carControls)}/>

            <Velocity
                title='obroty silnika'
                unit='obr/min'
                velocity={getValueByIndex('rp', carControls)}
            />
            <SmallData
                title='stacyjka'
                data={getValueByIndex('i', carControls)}
            />
            <SmallData
                title='wysokość'
                data={getValueByIndex('a', carControls)}
                unit='m n.p.m.'
            />
            <SmallData
                title='napięcie'
                data={getValueByIndex('sv', carControls)}
                unit='V'
            />
        </StyledWrapper>
    );
};

export default MainDataContent;

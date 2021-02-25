import React, {useContext} from 'react';
import styled from 'styled-components';
import MainDataContent from "../mainDataContent/MainDataContent";
import RestData from "../restData/RestData";
import CustomLink from "../../../atoms/customLink/CustomLink";
import {CarContext} from "../carDetail/CarDetail";

const StyledWrapper = styled.div`
  min-width: 100%;
  background-color: whitesmoke;

`

const CarPresentation = () => (
        <StyledWrapper>
            <MainDataContent/>
            <RestData/>
        </StyledWrapper>
    );

export default CarPresentation;

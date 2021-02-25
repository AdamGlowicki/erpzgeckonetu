import React from 'react';
import styled from 'styled-components';
import Graph from "../../molecules/graph/Graph";
import Tabs from "../../molecules/tabs/Tabs";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 90vw;
  height: 90vh;
`

const GraphStructure = () => {
    return (
        <StyledWrapper>
            <Tabs/>
            <Graph/>
        </StyledWrapper>
    );
};

export default GraphStructure;

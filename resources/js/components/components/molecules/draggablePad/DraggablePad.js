import React from 'react';
import styled from 'styled-components'

const StyledPad = styled.div`
  position: relative;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  overflow: auto;
  padding: 0;
  z-index: 1300;
`

const DraggablePad = ({children}) => {
    return (
        <StyledPad>
            {children}
        </StyledPad>
    );
};

export default DraggablePad;

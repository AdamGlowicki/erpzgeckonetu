import React from 'react';
import styled from 'styled-components';

const StyledCell = styled.div.attrs({
    className: 'd-flex justify-content-center rounded '
})`
  border: 2px solid black;
  font-size: 12px;
  font-weight: bolder;
  height: ${({matches}) => matches ? '100px' : '80px'};
`;

const CellToUploadFiles = ({children, matches}) => {
    return (
        <StyledCell matches={matches}>
            {children}
        </StyledCell>
    );
};

export default CellToUploadFiles;

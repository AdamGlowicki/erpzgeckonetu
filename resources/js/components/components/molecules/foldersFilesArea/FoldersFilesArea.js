import React from 'react';
import styled from 'styled-components';
import FoldersArea from './foldersArea/FoldersArea';
import FilesArea from './filesArea/FilesArea';

const StyledWrapper = styled.div.attrs({
    className: 'rounded'
})`
  grid-color:#000;
  display: grid;
  grid-template-rows: auto 1fr;
`;



const FoldersFilesArea = ({...props}) => {
    return (
        <StyledWrapper>
                <FoldersArea {...props}/>
                <FilesArea/>
        </StyledWrapper>
    );
};

export default FoldersFilesArea;

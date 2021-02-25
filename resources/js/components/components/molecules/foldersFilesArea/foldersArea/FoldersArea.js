import React from 'react';
import CreateFolder from '../cerateFolder/CreateFolder';
import GenerateFolders from '../generateFolders/GenerateFolders';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  grid-row: 1 / 2;
  display: grid;
  grid-template-columns: auto 50px;
  background-color:#fff;

`

const FoldersArea = ({folders, id, stageId}) => (
    <StyledWrapper>
        <GenerateFolders folders={folders} id={id} stageId={stageId}/>
        <CreateFolder id={id} stageId={stageId}/>
    </StyledWrapper>
);

export default FoldersArea;

import React from 'react';
import Folder from '../folder/Folder';
import {connect} from 'react-redux';
import styled from 'styled-components';

const StyledFoldersArea = styled.div.attrs({
    className: 'p-2'
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  overflow-x: scroll;
  &::-webkit-scrollbar{
  height: 5px;
  }
  &::-webkit-scrollbar-track {
  background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
  background: #ac0;
  }
`;

const GenerateFolders = ({folders, ...props}) => (
    <React.Fragment>
        <StyledFoldersArea>
            {folders && folders.map(item => <Folder key={item.id} data={item} {...props}/>)}
        </StyledFoldersArea>
    </React.Fragment>
);

export default GenerateFolders;

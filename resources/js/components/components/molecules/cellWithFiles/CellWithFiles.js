import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import File from '../foldersFilesArea/file/File';
import {FilePlace} from '../../../enums/files/filePlace';

const StyledCell = styled.div.attrs({
    className: 'ml-2 mb-2'
})`
  border: 1px solid #cdd;
  border-radius: 3px;
  font-size: 12px;
  min-width: 120px;
  font-weight: bolder;
`;

const CellWithFiles = (props) => {
    return (
        <StyledCell>
            <File file={{...props, place: FilePlace.CELL}}/>
        </StyledCell>
    );
};

CellWithFiles.propTypes = {
    id: PropTypes.number.isRequired,
    data: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

export default CellWithFiles;

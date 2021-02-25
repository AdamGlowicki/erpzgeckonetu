import React from 'react';
import styled from 'styled-components';
import SelectTable from '../../atoms/selectTbale/SelectTable';
import TableComponent from '../table/TableComponent';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';


const StyledWrapper = styled.div.attrs({
    className: 'ml-2 mt-2'
})`
  grid-column: 2 / -1;
  grid-row: 1 / 2;
  display: grid;
  justify-content: center;
`;

const TaskTable = ({table, id, stageId}) => {
    const tableData = {table, id, stageId}

    return (
        <StyledWrapper>
            {table ? (
                <TableComponent {...tableData}/>
            ) : (
                <SelectTable {...tableData}/>
            )}
        </StyledWrapper>
    );
};

export default TaskTable;

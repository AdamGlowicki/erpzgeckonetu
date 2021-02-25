import React from 'react';
import styled from 'styled-components';
import SelectStatus from '../../atoms/selectStatus/SelectStatus';
import FoldersFilesArea from '../foldersFilesArea/FoldersFilesArea';
import TaskNote from '../taskNote/TaskNote';
import TaskTable from '../taskTable/TaskTable';
import {useSelector} from "react-redux";
import {isAllow} from "../../../common/globalMethods";
import {AppPerm} from "../../../enums/permissions/permissions";

const StyledWrapper = styled.div.attrs({})`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 10vw auto;
  grid-template-rows: auto;
  margin-top: 16px;
`;

const StyledNoteFilesWrapper = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
`

const CellDetailWindow = ({table, id, stageId,...props}) => {
    const permission = useSelector(state => state.investments.permissions)
    const allowVisibleFolders = permission && isAllow(permission, [AppPerm.VISIBLE_FOLDERS])
    const allowVisibleNote = permission && isAllow(permission, [AppPerm.VISIBLE_FOLDERS])
    const allowVisibleTable = permission && isAllow(permission, [AppPerm.VISIBLE_Table])

    const tableData = {table, id , stageId,};
    return (
        <StyledWrapper>
            {allowVisibleTable && id && <TaskTable {...tableData}/>}
            <StyledNoteFilesWrapper>
                {allowVisibleFolders && <FoldersFilesArea {...props} stageId={stageId} id={id}/>}
                {allowVisibleNote && <TaskNote note={props.notes} stageId={stageId} id={id} {...props}/>}
            </StyledNoteFilesWrapper>
        </StyledWrapper>
    );
};

export default CellDetailWindow;

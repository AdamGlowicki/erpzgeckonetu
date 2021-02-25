import React, {Fragment, useEffect, useRef, useState} from 'react';
import CellTemplate from '../../../template/CellTemplate';
import {getColorByLabel, isAllow, limitString} from '../../../common/globalMethods';
import AddCell from '../../molecules/addCell/AddCell';
import RemoveCell from '../../molecules/removeCell/RemoveCell';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import {AppPerm} from "../../../enums/permissions/permissions";
import {clickOutsideHandler} from "../../support/closeByClickOutside/clickOutsideHandler";
import {Draggable} from 'react-beautiful-dnd';
import MenuItem from '@material-ui/core/MenuItem';
import DraggableModal from "../../molecules/draggableModal/DraggableModal";
import ContextMenu from "../../molecules/contextMenus/ContextMenu";
import EditContent from "../../molecules/editContent/EditContent";
import {useHistory} from "react-router";

const StyledMiniNote = styled.div`
  font-size: 8px;
  display: flex;
  align-self: flex-end;

`
const StyledButton = withStyles({
        root: {
            margin: 0,
            padding: 0,
            width: '100%',
            border: 'none',
            height: 'auto',
            '&.Mui-disabled': {
                border: 'none',
            }
        },
    }
)(Button);

const StyledTitle = styled.div`
  font-size: 10px;
  font-weight: 500;
  text-transform: none;
`

const StyledWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
`

const StyledContent = styled.div`
  grid-row: 2 / 3;
  height: 34px;
  overflow: hidden;
`

const StyledButtonBottom = styled.div.attrs({
    className: 'pl-1 pr-1'
})`
  grid-row: 3 / -1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`

const Cell = ({status, name, openModal, mini_note, stageId, id, index, position, ...props}) => {

    const detailWindowData = {name, mini_note, status, stageId, id, ...props};
    const openTaskWindow = useDispatch()

    const [stateName, setName] = useState('');
    const [isDisable, setDisable] = useState(true);
    const [open, setOpen] = useState(false);

    const history = useHistory()

    const permission = useSelector(state => state.investments.permissions)
    const allowOpenEdit = permission && isAllow(permission, [AppPerm.OPEN_TASK])
    const allowAddTask = permission && isAllow(permission, [AppPerm.ADD_TASK])
    const allowRemoveTask = permission && isAllow(permission, [AppPerm.DELETE_TASK])

    const inputRef = useRef(null);

    useEffect(() => {
        setName(name);
    }, [name]);

    const closeInputHandler = () => {
        if (!isDisable) {
            asyncUpdateName();
            setDisable(true);
        }
    };

    const handleOpenTask = () => {
        isDisable && history.push(`/react/invest/task/${stageId}/${id}`)
    }

    clickOutsideHandler(closeInputHandler, inputRef)

    const menuItems = (close) => (
        <MenuItem onClick={() => handleEdit(close)}>Edytuj</MenuItem>
    )

    const handleEdit = (close) => {
        close()
        setOpen(!open)
    }

    return (
        <Fragment>
            <Draggable draggableId={`${id}`} index={index} id={id}>
                {(provided) => (
                    <div
                        id='styled-cont'
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >

                        <CellTemplate color={getColorByLabel(status)} popoverMessage={name}>
                            <StyledWrapper>

                                <StyledContent>
                                    <ContextMenu menuItems={(close) =>menuItems(close)}>
                                        <StyledButton
                                            disabled={!allowOpenEdit}
                                            onClick={handleOpenTask}
                                            variant="outlined">
                                            <StyledTitle>{stateName}</StyledTitle>
                                        </StyledButton>
                                    </ContextMenu>
                                </StyledContent>

                                <StyledButtonBottom>
                                    <RemoveCell stageId={stageId} taskId={id} cellName={name} disabled={allowRemoveTask}/>
                                    <StyledMiniNote>{mini_note ? limitString(mini_note, 11) : ''}</StyledMiniNote>
                                    <AddCell disabled={allowAddTask} stageId={stageId} taskId={id} position={position}/>
                                </StyledButtonBottom>
                            </StyledWrapper>
                        </CellTemplate>
                    </div>
                )}
            </Draggable>
            <DraggableModal open={open} setOpen={setOpen}>
                <EditContent name={name} id={id} stageId={stageId} setOpen={setOpen}/>
            </DraggableModal>
        </Fragment>
    )
};

export default Cell;

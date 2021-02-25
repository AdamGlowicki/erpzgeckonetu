import React, {memo, useState} from 'react';
import MainCell from '../../atoms/mainCell/MainCell';
import styled, {css} from 'styled-components';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {Breakpoints} from "../../../enums/sizing/breakpionts";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {DragDropContext} from "react-beautiful-dnd";
import GenerateTasks from "../generateTasks/GenerateTasks";
import {useDispatch} from "react-redux";
import {UPDATE_ORDER_TASK_INVESTMENT} from "../../../reducers/investments/duck/reduxType";
import {putData} from "../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";

const StyledWrapper = styled.div.attrs({
    className: 'mb-1 mt-1'
})`
  display: flex;
  flex-direction: row;
  text-align:center;
  align-items: center;
  margin-left: ${({margin}) => margin === 1 ? 0 : (margin -1) * 30}px;
  ${({matches, margin}) => (
    matches && css`
        margin-left: ${margin * 16}px;
    `
)}
`;

const reducingColor = (stage) => (
    stage.level && [90 + (stage.level * 20), 170 +(stage.level * 10), 0]
);

export default memo (({stage, rolled}) => {

    const [cookies, setCookie] = useCookies(['name'])

    const [additionalCell, setAdditionalCell] = useState(stage.openClient);
    const matches = useMediaQuery(`(max-width:${Breakpoints.MD})`);
    const updateTasksPosition = useDispatch();

    const asyncUpdateOrderTasks = async(array)  => {
        try {
            const result = putData(`/task/updateOrder`, array, cookies)
            updateTasksPosition({type: UPDATE_ORDER_TASK_INVESTMENT, payload: {stageId: stage.id, tasks: array}})
        } catch (e) {
        }
    }

    const onDragEnd = async (result) => {
        const tasks = [...stage.tasks]

        const {destination, destination: {index: destinationIndex}, source: {index: sourceIndex}} = result;
        if (!destination) {
            return;
        }
        let sourceIdx = parseInt(sourceIndex)
        let destIdx = parseInt(destinationIndex)
        let draggedLink = tasks[sourceIdx]
        let newList = [...tasks]
        newList.splice(sourceIdx, 1);
        newList.splice(destIdx, 0, draggedLink)
        const newOrder = newList.map((item, index) => ({...item, position: index + 1}));

        await asyncUpdateOrderTasks(newOrder)
    }
    return (
        <StyledWrapper margin={stage.level} matches={matches}>
            <MainCell singleTask={stage}
                      message={stage.stage_name}
                      mainColor={reducingColor(stage)}
                      stageId={stage.id}
                      handleOpenAdditional={() => setAdditionalCell(!additionalCell)}
                      rolled={rolled}
                      {...stage}
            >
                {stage.stage_name ? stage.stage_name : 'Podinwestycja'}
            </MainCell>
            <ArrowForwardIcon style={{color:'yellowgreen', marginRight: '4px'}}/>

            <DragDropContext onDragEnd={onDragEnd}>
                <GenerateTasks stage={stage}/>
            </DragDropContext>
        </StyledWrapper>

    );
});

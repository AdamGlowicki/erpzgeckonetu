import React from 'react';
import Cell from "../../atoms/cell/Cell";
import {Droppable} from "react-beautiful-dnd";
import styled from 'styled-components'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: scroll;
  overflow-y: hidden;
  &::-webkit-scrollbar{
  height: 5px;
  }
  &::-webkit-scrollbar-track {
  background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
  background: #ac0;
  }
`

const GenerateTasks = ({stage}) => {

    const sortByPosition = (array) => (
        [...array.sort((a, b) => a.position - b.position)]
    )

    return (
        <Droppable droppableId={`${stage.id}`} direction="horizontal">
            {(provided) => (
                <StyledContainer
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {sortByPosition(stage.tasks).map((task, index) => {
                        return (<Cell parentIds={stage.parentIds} stageId={stage.id} index={index} {...task} key={task.id}/>)
                    })}
                    {provided.placeholder}
                </StyledContainer>
            )}
        </Droppable>
    );
};

export default GenerateTasks;

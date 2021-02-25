import React, {memo, useMemo, useState} from 'react';
import {groupedStageList} from '../../../common/groupStage';
import GenerateMainStage from "../generateMainStage/GenerateMainStage";
import styled from 'styled-components';
import GeneratedInvestment from "./GeneratedInvestment";
import {useDispatch} from "react-redux";
import {setLoading} from "../../../common/globalMethods";

const StyledWrapper = styled.div.attrs(props => ({
    className: props.rolled ? 'mb-5' : 'mb-3',
}))`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  width: ${props => props.rolled ? '90vw' : '80vw'};
  border-radius: 8px;
  box-shadow: 7px 6px 16px -5px rgba(0,0,0,0.58);
`

export default memo(({row, drawers, drawer}) => {
    const [rolled, setRolled] = useState(false);

    const dispatch = useDispatch();

    const stages = groupedStageList(row.stages);
    const getLongestStage = () => {
        let numbers = []
        stages.map(item => {
            numbers = [...numbers, item.tasks.length]
        });
        return numbers
    }
    const sortByGroup = (drawers, stages) => {
        const grouped = [];
        drawers && drawers.forEach(item => {
            const filtered = stages && stages.filter(stage => stage.drawer_id === item.id);
            grouped.push({name: item.name, values: filtered})
        })

        const rest = stages && stages.filter(item => !drawers.map(x => x.id).includes(item.drawer_id))

        return [...grouped, {name: 'Nieprzypisane', values: rest}];
    }

    const memoGroup = useMemo( (drawers, stages) => sortByGroup(drawers, stages),
        [drawers, stages])

    const getInvestByDrawer = () => (
        drawers && memoGroup.filter(item => item.name === drawer).map(item => item.values)[0]
    )

    const chooseData = () => (
        drawer === 'Wszystkie' ? stages : getInvestByDrawer()
    )

    return (
        <StyledWrapper rolled={rolled}>
            <GenerateMainStage rolled={rolled} setRolled={setRolled} stage={row}
                               longestLine={Math.max(...getLongestStage())} numberOfLines={stages.length}
                               generatedInvestment={<GeneratedInvestment rolled={rolled} stages={chooseData()}/>}/>

            {rolled && <GeneratedInvestment stages={chooseData()}/>}
        </StyledWrapper>
    );
});


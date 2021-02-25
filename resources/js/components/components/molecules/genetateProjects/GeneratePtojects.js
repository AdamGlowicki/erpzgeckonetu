import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {nest} from '../../../reducers/nest';
import GenerateStages from '../generateStages/GenerateStages';
import InvestTabs from "../tabs/InvestTabs";
import {SET_DRAWER} from "../../../reducers/investments/duck/reduxType";

const StyledRow = styled.div.attrs({
    className: 'mt-4'
})`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GenerateProjects = () => {
    const mainStage = useSelector(state => state.investments.mainStage)
    const setDrawerGlobal = useDispatch()
    const [drawer, setDrawer] = useState('');

    const drawers = useSelector(state => state.investments.drawers)

    useEffect(() => {
        setDrawer('Wszystkie')
    }, [])

    const sorted = mainStage && nest(mainStage);

    const handleSetDrawer = (e) => {
        const {textContent} = e.target
        setDrawer(textContent)
        setDrawerGlobal({type: SET_DRAWER, payload: textContent})
    }

    return (
        <StyledRow>
            <div className='mb-5 ml-5'>
                <InvestTabs handleClick={handleSetDrawer} drawers={drawers}/>
            </div>
            {sorted && sorted.map((row) => <GenerateStages row={row} key={row.id} drawers={drawers} drawer={drawer}/>)}
        </StyledRow>
    );
};

export default GenerateProjects;

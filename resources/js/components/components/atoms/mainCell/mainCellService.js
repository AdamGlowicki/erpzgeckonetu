import React, {useState} from 'react';
import {OPEN_EDIT_CELL} from '../../../reducers/investments/duck/reduxType';

export const openEdit = (data) => ({
    type: OPEN_EDIT_CELL,
    payload: data
})

const MainCellService = () => {
    const [isOpenSelect, setOpenSelect] = useState(false);

    const handleOpenSelect = () => {
        setOpenSelect(!isOpenSelect)
    };

    return ({isOpenSelect, handleOpenSelect})
};

export default MainCellService;

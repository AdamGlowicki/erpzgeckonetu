import React from 'react';
import {OPEN_MODAL} from '../../../reducers/investments/duck/reduxType';

export const toggleOpen = (data) => {
    return ({
        type: OPEN_MODAL,
        payload: data
    })
};

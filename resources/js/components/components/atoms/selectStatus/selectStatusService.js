import {CHANGE_STATUS} from '../../../reducers/investments/duck/reduxType';

export const changeStatus = (id, stageId, status) => {
    return ({
        type: CHANGE_STATUS,
        payload: {id, stageId, status}
    })
};

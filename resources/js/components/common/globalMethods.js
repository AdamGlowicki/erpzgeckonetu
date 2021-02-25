import {IS_ERROR, IS_LOADING, IS_SUCCESS, RESET_ERROR_SUCCESS} from '../reducers/investments/duck/reduxType';
import {statusTemplate} from "../enums/StatusTemplate";
import {findIndex} from "rxjs/operators";

export const limitString = (str = '', limit) => {
    !str && (str = '')
    if(str.length > limit) {
        return `${str.substring(0, limit)}...`
    }
    return str
};

export const limitStringWithoutDots = (str = '', limit) => {
    if(str.length > limit) {
        return str.substring(0, limit)
    }
    return str
};
export const displayPopover = (str= '', limit = 10) => (
    str.length > limit
);

export const getToday = () => {
    return new Date().toISOString().slice(0, 10)
};

export const setSuccess = payload => ({
    type: IS_SUCCESS,
    payload
});

export const setError = payload => ({
    type: IS_ERROR,
    payload
});

export const resetIsErrorIsSuccess = payload => ({
    type: RESET_ERROR_SUCCESS,
    payload
});

export const setLoading = payload => ({
    type: IS_LOADING,
    payload
});

export const getColorByLabel = (status) => (
    statusTemplate.filter(item => item.label === status).map(item => item.value)[0]
)

export const mapJsonToMyVariables = (array) => {
    return array.map(item => {
        return {
            ...item,
            parentId: item.parent_id,
            stageName: item.stage_name,
            files: item.invest_files.length ? [...item.invest_files] : [],
            tasks: item.tasks.length ? [...item.tasks.map(task => {
                return {
                    ...task,
                    folders: task.folders.length ? [...task.folders.map(folder=> {
                        return {
                            ...folder,
                            files: [...folder.folder_files]
                        }
                    })] : [],
                    table: task.tables.length ? [...task.tables.map(table => {
                        return {
                            ...table,
                            head: [...table.heads],
                            body: table.bodies,
                        }
                    })][0] : null,
                }
            })
            ] : []
        }
    })
}

export const getPositions = (array, stageId, taskId) => {
    let tasks = array.find(item => item.id === stageId).tasks
    const index = tasks.findIndex(task => task.id === taskId);
    return tasks.map((item, i) => {
        return i >= index ? {position: item.position + 1, id: item.id} : {position: item.position, id: item.id};
    }).sort((a, b) => a.position - b.position)
}

export const isAllow = (userPermissions, permissions) => (
    userPermissions.some(item => permissions.includes(item))
)

export const removeWhiteChart = (str) => (
    str.replace(/\s/g,'')
)


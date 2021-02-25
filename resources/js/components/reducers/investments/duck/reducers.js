import {
    ADD_CELL,
    ADD_COLUMN,
    ADD_FILE_TO_FOLDER,
    ADD_FOLDER,
    ADD_INVEST_FILE,
    ADD_INVESTMENT,
    ADD_MIDDLE_STAGE,
    ADD_TABLE,
    ADD_TABLE_ROW,
    ALL_FILES_UPLOADED,
    CHANGE_STATUS,
    CLOSE_EDIT_CELL,
    CLOSE_MODAL, DELETE_DRAWER_INVESTMENT,
    DELETE_TABLE,
    DELETE_TABLE_ROW, FETCH_DRAWERS,
    FIND_OBJECTS_IDS, GET_DATA,
    IS_ERROR,
    IS_LOADING,
    IS_SUCCESS,
    OPEN_EDIT_CELL,
    OPEN_FOLDER,
    OPEN_MODAL,
    REMOVE_DOCUMENT,
    REMOVE_FOLDER,
    REMOVE_MIDDLE_TASK,
    REMOVE_TASK,
    RESET_ERROR_SUCCESS, SAVE_DRAWER_INVESTMENT,
    SELECT_STATUS_IN_TABLE,
    SET_DATE_IN_TABLE, SET_DRAWER,
    SET_FIRST_COLUMN,
    SET_MAIN_CELLS_NAME, SET_PERMISSIONS,
    SET_TITLE_TABLE,
    UPDATE_ADDITIONAL_CELL, UPDATE_DRAWER_INVESTMENT,
    UPDATE_FOLDER_NAME, UPDATE_INVESTMENT_ID, UPDATE_MAIN_INVEST,
    UPDATE_MINI_NOTE,
    UPDATE_NAME,
    UPDATE_NOTE, UPDATE_ORDER_TASK_INVESTMENT,
    UPLOAD_FILE_TO_TABLE
} from './reduxType';
import {
    addCell,
    addColumn, addFileToFolder,
    addFileToTable,
    addFolder, addInvestFile,
    addInvestment,
    addMiddleStage,
    addRow,
    addTable,
    changeStatus, deleteDrawer,
    deleteTable,
    editMainCellName,
    findMainIdInTree,
    removeFileFromCell,
    removeFileFromFolder, removeFolder,
    removeFileFromTable,
    removeTableRow,
    removeTask, saveDrawer,
    setFirstColumn,
    setIfAllFilesUploaded, setPermissions,
    setTableData, updateAdditionalCell, updateDrawers,
    updateFolderName, updateInvestmentId, updateMainInvest, updateMiniNote,
    updateName, updateNote, updateOrderTasks,
    updateSecondTableStatus,
    updateTableStatus,
    updateTableTitle
} from './reduxMethod';
import {FilePlace} from '../../../enums/files/filePlace';
import {DragTypes} from '../../../enums/dragTypes';
import {TableDate} from '../../../enums/table/tableDate';
import {TableStatusType} from '../../../enums/table/tableStatusType';
import {TableAllFilesType} from '../../../enums/table/tableAllFilesType';
import {nest} from "../../nest";

const initState = {
    isOpenModal: false,
    mainStage: [],
    modalData: undefined,
    folderData: {},
    stageId: 50,
    taskId: 100,
    folderId: 150,
    countryId: 200,
};

const investmentReducer = (state = initState, {type, payload}) => {
    switch (type) {
        case ADD_INVESTMENT:
            return addInvestment(state, payload);
        case ADD_MIDDLE_STAGE:
            return addMiddleStage(state, payload);
        case OPEN_MODAL:
            return {...state, isOpenModal: true, modalData: payload};
        case CLOSE_MODAL:
            return {...state, isOpenModal: false, folderData: {},};
        case CHANGE_STATUS:
            return changeStatus(state, payload);
        case OPEN_EDIT_CELL:
            return {...state, isOpenEdit: true, editData: payload, setCellName: payload.setCellName};
        case CLOSE_EDIT_CELL:
            return {...state, isOpenEdit: false,};
        case UPDATE_NAME:
            return updateName(state, payload);
        case UPDATE_MINI_NOTE:
            return updateMiniNote(state, payload);
        case REMOVE_MIDDLE_TASK:
            return {
                ...state,
                mainStage: [...state.mainStage.filter(item => !payload.includes(item.id))]
            };
        case REMOVE_TASK:
            return removeTask(state, payload);
        case ADD_CELL:
            return addCell(state, payload);
        case ADD_FOLDER:
            return addFolder(state, payload);
        case OPEN_FOLDER:
            return {
                ...state,
                folderData: {...payload, isOpen: true},
                modalData: {
                    ...state.modalData,
                    folders: [
                        ...state.modalData.folders.map(folder => {
                            if (folder.id === payload.id) {
                                folder = {...folder, isOpen: true}
                            }
                            if (folder.id !== payload.id) {
                                folder.isOpen = false;
                                folder = {...folder, isOpen: false}
                            }
                            return {...folder}
                        })
                    ],
                },
            };
        case UPDATE_FOLDER_NAME:
            return updateFolderName(state, payload);
        case REMOVE_FOLDER:
            return removeFolder(state, payload);
        case REMOVE_DOCUMENT:
            switch (payload.place) {
                case FilePlace.CELL:
                    return removeFileFromCell(state, payload);
                case FilePlace.FOLDER:
                    return removeFileFromFolder(state, payload);
                case FilePlace.TABLE_PREV:
                    return removeFileFromTable(state, payload, 'prev_files');
                case FilePlace.TABLE_POST:
                    return removeFileFromTable(state, payload, 'post_files');
                case FilePlace.TABLE_SECOND:
                    console.log(payload)
                    return removeFileFromTable(state, payload, 'second_files');
                case FilePlace.TABLE_SECOND_POST:
                    return removeFileFromTable(state, payload, 'second_post_files');
            };
        case ADD_INVEST_FILE:
            return addInvestFile(state, payload);
        case ADD_FILE_TO_FOLDER:
                return addFileToFolder(state, payload);
        case UPDATE_NOTE:
            return updateNote(state, payload);
        case UPDATE_ADDITIONAL_CELL:
            return updateAdditionalCell(state, payload);
        case ADD_TABLE:
            console.log(payload)
            return addTable(state, payload);
        case SET_TITLE_TABLE:
            return updateTableTitle(state, payload);
        case SET_FIRST_COLUMN:
            return setFirstColumn(state, payload);
        case SET_MAIN_CELLS_NAME:
            return editMainCellName(state, payload);
        case UPLOAD_FILE_TO_TABLE:
            switch (payload.type) {
                case DragTypes.PREV_FILES_ON_TABLE:
                    return addFileToTable(state, payload, 'prev_files');
                case DragTypes.POST_FILES_ON_TABLE:
                    return addFileToTable(state, payload, 'post_files');
                case DragTypes.SECOND_FILES_ON_TABLE:
                    return addFileToTable(state, payload, 'second_files');
                case DragTypes.SECOND_POST_FILES_ON_TABLE:
                    return addFileToTable(state, payload, 'second_post_files');
                default:
            }
        case SET_DATE_IN_TABLE:
            switch (payload.type) {
                case TableDate.SEND:
                    return setTableData(state, payload, 'send_date');
                case TableDate.PICK:
                    return setTableData(state, payload, 'receive_date');
                case TableDate.SECOND:
                    return setTableData(state, payload, 'second_date');
                case TableDate.SECOND_PICK:
                    return setTableData(state, payload, 'post_second_date');
            }
        case SELECT_STATUS_IN_TABLE:
            switch (payload.type) {
                case TableStatusType.MAIN:
                    return updateTableStatus(state, payload);
                case TableStatusType.SECOND:
                    return updateSecondTableStatus(state, payload);
            }
        case DELETE_TABLE:
            return deleteTable(state, payload);
        case ALL_FILES_UPLOADED:
            switch (payload.type) {
                case TableAllFilesType.MAIN:
                    return setIfAllFilesUploaded(state, payload, 'all_files');
                case TableAllFilesType.SECOND:
                    return setIfAllFilesUploaded(state, payload, 'is_all_second_files');
            }
        case ADD_TABLE_ROW:
            return addRow(state, payload);
        case DELETE_TABLE_ROW:
            return removeTableRow(state, payload);
        case ADD_COLUMN:
            return addColumn(state, payload);
        case IS_LOADING:
            return {...state, isLoading: payload};
        case IS_ERROR:
            const {isError, errorMessage} = payload;
            return {...state, isError, errorMessage};
        case IS_SUCCESS:
            return {...state, isSuccess: payload.isSuccess, successMessage: payload.successMessage};
        case RESET_ERROR_SUCCESS:
            return {...state, isSuccess: false, isError: false};
        case FIND_OBJECTS_IDS:
            let stageWithNullParent = state.mainStage.find(stage => stage.id === payload.stageId);
            stageWithNullParent.parent_id = null
            const newList = state.mainStage.map(stage => {
                return payload.stageId === stage.id ? {
                    ...stageWithNullParent
                } : {...stage}
            })
            const object = nest(newList).find(stage => stage.id === payload.stageId);
            const arrIds = findMainIdInTree(object);
            return {...state, treeIds: arrIds,}
        case GET_DATA:
            return {...state, mainStage: [...payload.data]}
        case UPDATE_MAIN_INVEST:
            return updateMainInvest(state, payload)
        case SET_PERMISSIONS:
            return setPermissions(state, payload)
        case SET_DRAWER:
            return {...state, drawer: payload}
        case UPDATE_INVESTMENT_ID:
            return updateInvestmentId(state, payload)
        case UPDATE_ORDER_TASK_INVESTMENT:
            return updateOrderTasks(state, payload)
        case FETCH_DRAWERS:
            return {...state, drawers: payload}
        case UPDATE_DRAWER_INVESTMENT:
            return updateDrawers(state, payload)
        case SAVE_DRAWER_INVESTMENT:
            return saveDrawer(state, payload)
        case DELETE_DRAWER_INVESTMENT:
            return deleteDrawer(state, payload);
        default:
            return state;
    }
};
export default investmentReducer;

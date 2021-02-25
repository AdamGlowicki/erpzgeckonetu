import {ADD_FOLDER_AGREEMENTS, DELETE_FOLDER_AGREEMENTS, GET_AGREEMENTS, SET_NAME_FOLDER_AGREEMENTS} from "./type";

export const putAgreementsToStoreAgreements = (payload) => ({
    type: GET_AGREEMENTS,
    payload,
})

export const putFolderToStoreAgreements = payload => ({
    type: ADD_FOLDER_AGREEMENTS,
    payload,
})

export const setFolderNameAgreements = payload => ({
    type: SET_NAME_FOLDER_AGREEMENTS,
    payload
})

export const deleteFolderAgreements = payload => ({
    type: DELETE_FOLDER_AGREEMENTS,
    payload
})

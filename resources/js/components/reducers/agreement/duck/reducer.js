import {ADD_FOLDER_AGREEMENTS, DELETE_FOLDER_AGREEMENTS, GET_AGREEMENTS, SET_NAME_FOLDER_AGREEMENTS} from "./type";
import {removeFolderAgreements, updateFolderNameAgreements} from "./methosd";

const initState = {}

const agreementReducer = (state = initState, {type, payload}) => {
    switch (type) {
        case GET_AGREEMENTS:
            return {...state, agreementFolders: payload};
        case ADD_FOLDER_AGREEMENTS:
            return {...state, agreementFolders: [...state.agreementFolders, payload]}
        case SET_NAME_FOLDER_AGREEMENTS:
            return updateFolderNameAgreements(state, payload)
        case DELETE_FOLDER_AGREEMENTS:
            return removeFolderAgreements(state, payload);
        default:
            return state;
    }
}

export default agreementReducer;

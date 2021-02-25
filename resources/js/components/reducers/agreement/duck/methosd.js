export const updateFolderNameAgreements = (state, payload) => ({
    ...state,
    agreementFolders: [...state.agreementFolders.map(folder => {
        return folder.id === payload.id ? {
            ...folder,
            name: payload.name
        } : {...folder}
    })]
})

export const removeFolderAgreements = (state, payload) => ({
    ...state,
    agreementFolders: [...state.agreementFolders.filter(folder => folder.id !== payload)]
})

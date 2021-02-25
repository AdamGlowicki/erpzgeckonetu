import {getData} from "../../../common/apiMethods/apiMethods";
import {putAgreementsToStoreAgreements} from "./actions";

export const fetchAgreements = (cookies) => (
    async (dispatch) => {
        const agreements = await getData('/agreementFolders', cookies)
        dispatch(putAgreementsToStoreAgreements(agreements.data))
    }
)

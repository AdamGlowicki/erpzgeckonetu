import React from 'react';
import styled from 'styled-components'
import AssignmentIcon from '@material-ui/icons/Assignment';
import IconButton from '@material-ui/core/IconButton';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Folder from "./Folder";
import {useDispatch, useSelector} from "react-redux";
import {setError, setLoading} from "../../../common/globalMethods";
import {useCookies} from "react-cookie";
import {putFolderToStoreAgreements} from "../../../reducers/agreement/duck/actions";
import {postData} from "../../../common/apiMethods/apiMethods";
import FolderContent from "./FolderContent";
import DraggableModal from "../draggableModal/DraggableModal";

const StyledWrapper = styled.section`
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-width: 30vw;
  min-height: 50vh;
`

const StyledHeda = styled.div`
  grid-row: 1 / 2;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const StyledContent = styled.div.attrs({
    className: ''
})`
  max-height: 40vh;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-right: auto;
`

const StyledFooter = styled.div`
  grid-template-rows: 3 / -1;
`
const ClientAgreementsContent = ({open, ...props}) => {
    const [cookies, setCookies] = useCookies();

    const agreementsFolders = useSelector(state => state.agreements.agreementFolders)

    const dispatchLoading = useDispatch()
    const dispatchError = useDispatch()
    const dispatchFolder = useDispatch();

    const asyncAddFolder = async () => {
        dispatchLoading(setLoading(true))
        try {
            const result = await postData('/agreementFolders/add', {name: 'Nowy folder',}, cookies)
            dispatchFolder(putFolderToStoreAgreements({id: result.data.id, name: 'Nowy folder', disable: false}))
        } catch (e) {
            dispatchError(setError({isError: true, errorMessage: 'Nie udało sie dodać folderu'}))
        }
        dispatchLoading(setLoading(false))
    }

    return (
        <StyledWrapper>
            <StyledHeda>
                <div className='d-flex flex-row justify-content-start'>
                    <div className='mr-2'>
                        <AssignmentIcon/>
                    </div>
                    <div style={{fontSize: '16px', fontWeight: '600'}}>
                        Dokumenty przedinwestycyjne
                    </div>
                </div>

                <div>
                    <IconButton onClick={asyncAddFolder}>
                        <CreateNewFolderIcon style={{color: 'orange'}}/>
                    </IconButton>
                </div>
            </StyledHeda>

            <StyledContent>
                {agreementsFolders && agreementsFolders.map((item, i) => (
                    <Folder key={item.id} folder={item} index={i} {...props}/>)
                )}
            </StyledContent>

            <StyledFooter>

            </StyledFooter>
        </StyledWrapper>
    );
};

export default ClientAgreementsContent;

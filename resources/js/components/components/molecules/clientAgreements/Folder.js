import React, {Fragment, useEffect, useRef, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Button from '@material-ui/core/Button';
import NakedInput from "../../atoms/nakedInput/NakedInput";
import {clickOutsideHandler} from "../../support/closeByClickOutside/clickOutsideHandler";
import ContextMenu from "../contextMenus/ContextMenu";
import MenuItem from "@material-ui/core/MenuItem";
import {useDispatch} from "react-redux";
import {setError, setLoading, setSuccess} from "../../../common/globalMethods";
import {deleteData, patchData} from "../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {deleteFolderAgreements, setFolderNameAgreements} from "../../../reducers/agreement/duck/actions";
import AcceptWindow from "../acceptWindow/AcceptWindow";
import FolderContent from "./FolderContent";
import DraggableModal from "../draggableModal/DraggableModal";

const slide = keyframes`
  0% {transform: translateX(-50px); opacity: 0}
  60% {transform: translateX(5px); opacity: 0.7}
  100% {transform: translateX(0); opacity: 1}
`

const StyledWrapper = styled.div.attrs({
    className: 'mr-4'
})`
  display: ${props => props.display ? 'flex' : 'none'};
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  animation: ${slide} 1s;
`

const Folder = ({index, folder: {id, name: propsName, disable: propsDisable, agreement_files}}) => {
    const [display, setDisplay] = useState(false)
    const [disable, setDisable] = useState(true);
    const [name, setName] = useState('')
    const [openAcceptWindow, setOpenAcceptWindow] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [openFolder, setOpenFolder] = useState(false);

    const inputRef = useRef(null);

    const [cookies, set] = useCookies();

    const dispatch = useDispatch()

    useEffect(() => {
        const handler = setTimeout(() => setDisplay(true), index * 100)

        return () => {
            clearTimeout(handler)
        }
    }, [])

    useEffect(() => {
        if (propsDisable === false) {
            setDisable(propsDisable)
        }
        if (disable) {
            setName(propsName);
        }
    }, [propsName, propsDisable])


    const handleSetName = e => {
        const {value} = e.target;
        setName(value)
    }

    const asyncUpdateName = async () => {
        dispatch(setLoading(true))
        try {
            await patchData(`/agreementFolders/edit/${id}`, {name,}, cookies)
            dispatch(setFolderNameAgreements({id, name,}))
            dispatch(setSuccess({isSuccess: true, successMessage: `Zaktualizowano nazwę na ${name}`}))
        } catch (e) {
            dispatch(setLoading(false))
            setName(propsName)
            dispatch(setError({isError: true, errorMessage: `Nie udało się zmienić nazwy folderu na ${name}`}))
        }
        dispatch(setLoading(false))
    }

    const asyncDeleteFolder = async () => {
        dispatch(setLoading(true))
        try {
            await deleteData(`/agreementFolders/delete/${id}`, cookies)
            dispatch(deleteFolderAgreements(id))
        } catch (e) {
            dispatch(setLoading(false))
            dispatch(setError({isError: true, errorMessage: `Nie udało sie usunąć folderu ${name}`}))
        }
        dispatch(setLoading(false))
    }

    const closeInputHandler = async () => {
        if (!disable) {
            await asyncUpdateName();
            setDisable(true);
            setDisableButton(false)
        }
    };

    const handleDeleteFolder = close => {
        setOpenAcceptWindow(true);
        close()
    }

    const handleChooseEditName = async (close) => {
        setDisable(false)
        setDisableButton(true)
        close()
    }

    const generateMenuItems = (close) => {
        return ([
            <MenuItem key={1} onClick={() => handleChooseEditName(close)}>Edytuj folder {name}</MenuItem>,
            <MenuItem key={2} onClick={() => handleDeleteFolder(close)}>Usuń folder {name}</MenuItem>
        ])
    }

    clickOutsideHandler(closeInputHandler, inputRef)

    return (
        <Fragment>
            <StyledWrapper display={display ? 'true' : undefined}>
                <div
                    ref={inputRef}
                >
                    <ContextMenu menuItems={generateMenuItems}>
                        <Button
                            onClick={() => setOpenFolder(!openFolder)}
                            startIcon={
                                openFolder ?
                                    <FolderOpenIcon style={{color: 'orange'}}/>
                                    :
                                    <FolderIcon style={{color: 'orange'}}/>}
                        >
                            <NakedInput
                                disabled={disable}
                                onChange={handleSetName}
                                disableUnderline
                                value={name}
                                textalign='left'
                            />
                        </Button>
                    </ContextMenu>
                </div>

            </StyledWrapper>

            <AcceptWindow
                open={openAcceptWindow}
                handleClose={setOpenAcceptWindow}
                handleApproved={asyncDeleteFolder}
            >
                Czy na pewno chcesz usunąć folder {name} z całą zawartością?
            </AcceptWindow>

            <DraggableModal  open={openFolder} setOpen={setOpenFolder}>
                <FolderContent name={name}
                               files={agreement_files}
                               folderId={id}/>
            </DraggableModal>
        </Fragment>
    );
};

export default Folder;

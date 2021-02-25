import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import {OPEN_FOLDER, REMOVE_FOLDER, UPDATE_FOLDER_NAME} from '../../../../reducers/investments/duck/reduxType';
import {connect} from 'react-redux';
import ContextMenuToFolder from '../../contextMenus/contextMenuToFolder/ContextMenuToFolder';
import Input from '@material-ui/core/Input';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {clickOutsideHandler} from '../../../support/closeByClickOutside/clickOutsideHandler';
import {deleteData, patchData,} from '../../../../common/apiMethods/apiMethods';
import MyCircularProgress from '../../myCircularProgress/MyCircularProgress';
import {setError, setLoading, setSuccess} from '../../../../common/globalMethods';
import AcceptWindow from '../../acceptWindow/AcceptWindow';
import {useCookies} from "react-cookie";
import CustomLink from "../../../atoms/customLink/CustomLink";
import {useHistory, useParams} from 'react-router-dom'
import { generatePath } from "react-router";

const StyledFolder = styled.div.attrs({
    className: 'd-flex flex-column ml- mr-1 flex-column justify-content-center align-items-center'
})`
  font-size: 8px;
  width: 64px;
`

const openFolder = (data) => ({
    type: OPEN_FOLDER,
    payload: data
});

const styledInput = makeStyles({
    root: {
        maxWidth: '56px',
        fontSize: '12px'
    }
});

const removeFolder = (payload) => ({
    type: REMOVE_FOLDER,
    payload
});

const update = (payload) => ({
    type: UPDATE_FOLDER_NAME,
    payload
});

const Folder = ({data, id: taskId, stageId, updateFolderName, removeFolder, setLoading, setSuccess, setError}) => {

    const [isDisable, setDisable] = useState(true);
    const [stateFolderName, setStateFolderName] = useState('');
    const [openAcceptWindow, setOpenAcceptWindow] = useState(false);

    const [cookies, setCookie] = useCookies(['name']);

    const inputRef = useRef(null);

    const {folderId} = useParams();

    const history = useHistory();

    useEffect(() => {
        setStateFolderName(data.folder_name)
    }, [data.folder_name]);

    const asyncUpdateFolderName = async () => {
        setLoading(true);
        try {
            await patchData(`/folder/${data.id}`, {folder_name: stateFolderName}, cookies);
            updateFolderName({id: data.id, value: stateFolderName, taskId, stageId});
            setSuccess({isSuccess: true, successMessage: `Pomyślnie zmieniono nazwę na ${stateFolderName}`})
        } catch (e) {
            setLoading(false);
            setError({isError: true, errorMessage: 'Nie udało się zmienić nazwy folderu.'})
            setStateFolderName(data.folder_name);
        }
        setLoading(false);
    };

    const redirectAfterDelete = generatePath('/react/invest/task/:stageId/:taskId', {
        stageId: stageId,
        taskId: taskId,
    })

    const asyncRemoveFolder = async () => {
        setLoading(true);
        try {
            await deleteData(`/folder/${data.id}`, cookies);
            removeFolder({data, stageId, taskId})
            history.push(redirectAfterDelete)
        } catch (e) {
            setLoading(false);
            setError({isError: true, errorMessage: `Nie udało się usunąć folderu`})
        }
        setOpenAcceptWindow(false);
        setLoading(false);
    };

    const closeInputHandler = async() => {
        if (!isDisable) {
            await asyncUpdateFolderName();
            setDisable(true)
        }
    };

    const handleChangeFolderName = (e) => {
        const {value} = e.target;
        setStateFolderName(value);
    };

    const path = generatePath('/react/invest/task/:stageId/:taskId/:folderId', {
        stageId: stageId,
        taskId: taskId,
        folderId: data.id,
    })

    clickOutsideHandler(closeInputHandler, inputRef);
    return (
        <React.Fragment>
            <ContextMenuToFolder setDisable={setDisable} handleRemoveFolder={() => setOpenAcceptWindow(true)}>
                    <CustomLink to={!folderId ? path : redirectAfterDelete}>
                        <StyledFolder>
                            {folderId == data.id ? (
                                <FolderOpenIcon fontSize='small' style={{color: 'orange'}}/>
                            ) : (
                                <FolderIcon fontSize='small' style={{color: 'orange'}}/>
                            )}
                            <div>
                                <Input
                                    ref={inputRef}
                                    className={styledInput().root}
                                    value={stateFolderName}
                                    disabled={isDisable}
                                    disableUnderline={true}
                                    onChange={handleChangeFolderName}
                                />
                            </div>
                        </StyledFolder>
                    </CustomLink>
            </ContextMenuToFolder>
            <MyCircularProgress/>
            <AcceptWindow
                open={openAcceptWindow}
                handleApproved={asyncRemoveFolder}
                handleClose={setOpenAcceptWindow}
            >
                Czy na pewno chcesz usunąć folder {data.folder_name}
            </AcceptWindow>
        </React.Fragment>
    );
};

const mapDispatchToProps = dispatch => ({
    removeFolder: (data) => dispatch(removeFolder(data)),
    openFolder: (data) => dispatch(openFolder(data)),
    updateFolderName: (data) => dispatch(update(data)),
    setLoading: data => dispatch(setLoading(data)),
    setSuccess: data => dispatch(setSuccess(data)),
    setError: data => dispatch(setError(data)),
});

export default connect(null, mapDispatchToProps)(Folder);


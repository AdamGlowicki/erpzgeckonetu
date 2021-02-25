import React, {useEffect, useState} from 'react';
import File from "../../foldersFilesArea/file/File";
import {FilePlace} from "../../../../enums/files/filePlace";
import MyDropZone from "../../dropZone/DropZone";
import EveryFileCheckbox from "../everyFileCheckbox/EveryFileCheckbox";
import TableCell from "@material-ui/core/TableCell";
import {patchData, postData, postFile} from "../../../../common/apiMethods/apiMethods";
import {setError} from "../../../../common/globalMethods";
import {
    ALL_FILES_UPLOADED,
    IS_ERROR,
    IS_LOADING,
    UPLOAD_FILE_TO_TABLE
} from "../../../../reducers/investments/duck/reduxType";
import {useCookies} from "react-cookie";
import styled from "styled-components";
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles,} from "@material-ui/core/styles";
import StartScan from "../../startScan/StartScan";
import SetTimeForm from "../../setTimeForm/SetTimeForm";
import DraggableModal from "../../draggableModal/DraggableModal";
import InputText from "../../../atoms/inputText/InputText";
import MenuItem from "@material-ui/core/MenuItem";

const StyledDropCheck = styled.div`
  width: 50px;
  display: flex;
  flex-direction: column;
`;
console.log()
const styledAllFilesUploaded = makeStyles(theme => ({
    smallSize: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        background: ({background, secondBackground}) => background ? 'yellowgreen' : secondBackground,
        borderRadius: ({background}) => background && '12px'
    }
}));

const FilesWitchCheckbox = ({
                                prev_files, place, taskName, rowColor, id,
                                stageId, taskId, all_files, dragType, formDataKey,
                                url, checkKey, emailKey, checkPosition, user_id,

                            }) => {
    const [isAllFilesUpload, setAllFilesUpload] = useState(false);
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});

    const dispatch = useDispatch()

    const storeUsers = useSelector(state => state.user.users)

    const [cookies, setCookie] = useCookies(['name'])

    const styledUploadedAllFiles = styledAllFilesUploaded({
        background: isAllFilesUpload,
        secondBackground: rowColor
    });

    useEffect(() => {
        if (storeUsers.length) setUsers(storeUsers)
    }, [storeUsers])

    useEffect(() => {
        if (storeUsers.length) {
            const user = storeUsers.filter(item => item.id === user_id)[0]
            setUser(user)
        }
    },[user_id, storeUsers])

    useEffect(() => {
        all_files ? all_files = true : all_files = false;
        setAllFilesUpload(all_files);

    }, [all_files])

    const handlePrevFileDragdown = async (file) => {
        const formData = new FormData()
        formData.append(formDataKey, file[0])
        formData.append('body_id', id)

        dispatch({type: IS_LOADING, payload: true});
        try {
            const response = await postFile(url, formData, cookies);
            const {id: resId, data} = response.data;
            dispatch({
                type: UPLOAD_FILE_TO_TABLE,
                payload: {file: file[0], type: dragType, rowId: id, id: resId, data, stageId, taskId}
            })
        } catch (e) {
            dispatch({type: IS_LOADING, payload: false});
            dispatch({
                type: IS_ERROR,
                payload: {isError: true, errorMessage: `Nie udało się dodać pliku ${file[0].name}`}
            })
        }
        dispatch({type: IS_LOADING, payload: false});

    };

    const handleUpdateIfAllFilesUploaded = async e => {
        const {checked} = e.target;
        setAllFilesUpload(checked);
        await asyncAllFilesUploaded(checked);
    };

    const asyncAllFilesUploaded = async (checked) => {
        dispatch({type: IS_LOADING, payload: true});
        try {
            await patchData(`/body/${id}`, {[checkKey]: checked}, cookies);
            dispatch({type: ALL_FILES_UPLOADED, payload: {checked, type: checkPosition, rowId: id, stageId, taskId}});
        } catch (e) {
            dispatch({type: IS_LOADING, payload: false});
            dispatch({type: IS_ERROR, payload: {isError: true, errorMessage: 'Nie udało sie przeprowadzić tej akcji'}})
            setAllFilesUpload(!checked);
        }
        dispatch({type: IS_LOADING, payload: false});
    };

    const scanPlace = place === FilePlace.TABLE_PREV ? 'prevFile' : 'secondFile'
    const scanPlaceName = place === FilePlace.TABLE_PREV ? 'wysłanych plików' : ' drugich wysłanych plików'

    const asyncSendMali = async (value) => {
        try {
            await patchData(`/body/${id}`, {[emailKey]: value.id}, cookies);
            await postData('investmentNotification',{mail: window.location.href, id: value.id}, cookies)
        } catch (e) {
            dispatch(setError({isError: true, errorMessage: 'Nie udało się wysłać maila'}))
        }
    }

    const handleChangeUser = async (e) => {
        const {value} = e.target;
        setUser(value)
        await asyncSendMali(value);
    }

    return (
        <TableCell className={styledUploadedAllFiles.smallSize}>
            <div>
                <div className='d-flex flex-row justify-content-end'>
                    <div className='d-flex flex-column'>
                        {prev_files && prev_files.map(file => (
                            <File key={file.id} file={{...file, place, rowId: id}} taskId={taskId}
                                  stageId={stageId}/>))}
                    </div>
                    <StyledDropCheck>
                        <div className='d-flex ml-1'>
                            <MyDropZone callback={handlePrevFileDragdown}/>
                            <StartScan withBackground={isAllFilesUpload} size='small' setOpen={setOpen}/>
                        </div>

                        <EveryFileCheckbox
                            checkedState={isAllFilesUpload}
                            handleCheckbox={handleUpdateIfAllFilesUploaded}
                        />
                    </StyledDropCheck>
                </div>

                {isAllFilesUpload ? (
                    <InputText
                        select
                        label='Do'
                        size='small'
                        width={'100%'}
                        value={user}
                        onChange={handleChangeUser}
                    >
                        {users.length ? users.map(user => (
                            <MenuItem key={user.id} value={user}>{user.name}</MenuItem>
                        )) : null}
                    </InputText>
                ) : null}
            </div>

            <DraggableModal open={open} setOpen={setOpen}>
                <SetTimeForm
                    setOpen={setOpen}
                    body_id={id}
                    place={scanPlace}
                    placeName={`etapu: ${taskName} ${scanPlaceName}`}
                />
            </DraggableModal>
        </TableCell>
    );
};

export default FilesWitchCheckbox;

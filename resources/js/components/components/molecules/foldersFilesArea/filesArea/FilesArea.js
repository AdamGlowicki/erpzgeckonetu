import React, {Fragment, useState} from 'react';
import MyDropZone from '../../dropZone/DropZone';
import styled from 'styled-components';
import UploadedFiles from '../uploadedFiles/UploadedFiles';
import {ADD_FILE_TO_FOLDER} from '../../../../reducers/investments/duck/reduxType';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setError, setLoading} from '../../../../common/globalMethods';
import {postFile} from '../../../../common/apiMethods/apiMethods';
import {useCookies} from "react-cookie";
import StartScan from "../../startScan/StartScan";
import DraggableModal from "../../draggableModal/DraggableModal";
import SetTimeForm from "../../setTimeForm/SetTimeForm";
import {useParams} from "react-router";

const StyledWrapper = styled.div`
  grid-row: 2 / 3;
`

const StyledDropZone = styled.div`
  grid-column: span 3 / -1;
  grid-row: 3 / -1;
`;

const saveFile = (payload) => ({
    type: ADD_FILE_TO_FOLDER,
    payload
});

const FilesArea = ({saveFile, setError, setLoading}) => {

    const [cookies, setCookie] = useCookies(['name'])
    const [open, setOpen] = useState(false)

    const {stageId: paramStageId, taskId: paramTaskId, folderId: paramFolderId} = useParams()

    const stageId = parseInt(paramStageId);
    const taskId = parseInt(paramTaskId);
    const folderId = parseInt(paramFolderId);

    const handleDropdown = async (file) => {
        if (folderId) {
            const formData = new FormData()
            formData.append('folder', file[0])
            formData.append('folder_id', paramFolderId)
            setLoading(true);
            try {
                const result = await postFile('/folderFile', formData, cookies);
                saveFile({file: file[0], id: result.data.id, data: result.data.data, folderId, stageId, taskId})
            } catch (e) {
                setLoading(false);
                setError({isError: true, errorMessage: `Nie udało się dodać pliku ${file[0].name}.`})
            }
            setLoading(false);
        } else {
            window.alert('Najpierw wybierz folder.');
        }

    };
    return (
        <Fragment>
            <StyledWrapper>
                <div className='d-flex flex-column'>
                    <StyledDropZone>
                        <MyDropZone callback={handleDropdown} arrowSize={80}/>
                    </StyledDropZone>

                    <StartScan withBackground size='small' big setOpen={setOpen}/>
                </div>

                <UploadedFiles/>
            </StyledWrapper>

            <DraggableModal open={open} setOpen={setOpen}>
                <SetTimeForm setOpen={setOpen} placeName={`folderu`} folder_id={folderId} place='folderFiles'/>
            </DraggableModal>
        </Fragment>
    );
};

const mapDispatchToProps = dispatch => ({
    saveFile: (payload) => dispatch(saveFile(payload)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
});

FilesArea.propTypes = {
    saveFile: PropTypes.func
};

export default connect(null, mapDispatchToProps)(FilesArea);

import React, {Fragment, useState} from 'react';
import styled from 'styled-components';
import FolderIcon from '@material-ui/icons/Folder';
import File from "../foldersFilesArea/file/File";
import {FilePlace} from "../../../enums/files/filePlace";
import MyDropZone from "../dropZone/DropZone";
import {postFile} from "../../../common/apiMethods/apiMethods";
import {useDispatch} from "react-redux";
import {setError, setLoading} from "../../../common/globalMethods";
import {useCookies} from "react-cookie";
import StartScan from "../startScan/StartScan";
import DraggableModal from "../draggableModal/DraggableModal";
import SetTimeForm from "../setTimeForm/SetTimeForm";

const StyledWrapper = styled.section`
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr 200px;
  min-width: 30vw;
  min-height: 50vh;
`

const StyledHead = styled.div`
  grid-row: 1 / 2;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
`

const StyledContent = styled.div.attrs({
    className: 'mt-3'
})`
  max-height: 40vh;
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-right: auto;
`

const StyledUploadFiles = styled.div.attrs({
    className: 'm-2'
})`
  grid-row: 2 / 3;
  grid-column: 2 / -1;
`

const StyledDropZone = styled.div`
  width: 100%;
  height: 80%;
  border: 1px solid yellowgreen;
  border-radius: 8px;
`
const FolderContent = ({name, files, folderId}) => {

    const dispatch = useDispatch()
    const [cookies, set] = useCookies();

    const [open, setOpen] = useState(false);

    const handleDropdown = async (file) => {
        const formdata = new FormData();
        formdata.append("agreements", file[0]);
        formdata.append('folder_id', folderId);

        dispatch(setLoading(true));
        try {
            await postFile('/agreementFile', formdata, cookies);
        } catch (e) {
            dispatch(setLoading(false))
            dispatch(setError({isError: true, errorMessage: `Nie udało się dodać pliku ${file[0].name}.`}))
        }
        dispatch(setLoading(false));

    };
    return (
        <Fragment>
            <StyledWrapper>
                <StyledHead>
                    <div>
                        <FolderIcon fontSize='large' style={{color: 'orange'}}/>
                    </div>
                    <div className='ml-2'>
                        {name}
                    </div>
                </StyledHead>

                <StyledContent>
                    {files && files.map(file => (
                        <File key={file.id} file={{...file, place: FilePlace.AGREEMENTS}}/>
                    ))}
                </StyledContent>

                <StyledUploadFiles>
                    <StyledDropZone>
                        <MyDropZone callback={handleDropdown} arrowSize={100}/>
                    </StyledDropZone>
                    <StartScan withBackground size='small' big setOpen={setOpen}/>
                </StyledUploadFiles>
            </StyledWrapper>

            <DraggableModal setOpen={setOpen} open={open}>
                <SetTimeForm setOpen={setOpen} agreement_folder_id={folderId} place='agreementFiles' placeName={`folderu ${name}`}/>
            </DraggableModal>
        </Fragment>
    );
};

export default FolderContent;

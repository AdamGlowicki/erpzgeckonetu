import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {connect, useSelector} from 'react-redux';
import File from '../file/File';
import {FilePlace} from '../../../../enums/files/filePlace';
import {useHistory, useParams} from "react-router";

const StyledWrapper = styled.div`
  height: 150px;
  background-color: rgba(155,192,0);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: scroll;
  &::-webkit-scrollbar{
  width: 5px;
  }
  &::-webkit-scrollbar-track {
  background: #fff;
  }
  &::-webkit-scrollbar-thumb {
  background: #ac0;
  }
`;

const UploadedFiles = () => {
    const [files, setFiles] = useState([]);

    const {stageId: paramStageId, taskId: paramTaskId, folderId: paramFolderId} = useParams()

    const stageId = parseInt(paramStageId);
    const taskId = parseInt(paramTaskId);
    const folderId = parseInt(paramFolderId);

    const stageData = useSelector(state => state.investments.mainStage);

    useEffect(() => {
        if (stageData.length) {
            const folder = stageData
                .filter(({id}) => id === stageId)[0].tasks
                .filter(({id}) => id === taskId)[0].folders
                .filter(({id}) => id === folderId)[0]
            if (folder) {
                setFiles(folder.folder_files)
            }
            if (isNaN(folderId)) setFiles([])
        }
    }, [stageData, folderId])

    return (
        <StyledWrapper>
            {files && files.map(file => (
                <File
                    key={file.id}
                    file={{...file, place: FilePlace.FOLDER}}
                    folderId={folderId}
                    stageId={stageId}
                    taskId={taskId}
                />
            ))}
        </StyledWrapper>
    );
};

export default UploadedFiles;

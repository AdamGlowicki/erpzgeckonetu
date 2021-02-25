import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import styled from 'styled-components';
import PublishIcon from '@material-ui/icons/Publish';

const StyledBeforeDrag = styled.div.attrs({
    className: 'w-100 h-100 d-flex justify-content-center flex-column align align-items-center'
})`
  background-color:#fff;
  color: rgb(162,198,0);
  border-radius: 12px;
`;

const StyledFileAboveDrag = styled(StyledBeforeDrag)`
  opacity: 0.6;
  border: 4px dashed cadetblue;
`;


const MyDropZone = ({arrowSize, callback}) => {
    const onDrop = useCallback(file => {
        callback(file);
    }, [callback]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <div style={{width: '100%', height: '100%'}} {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ? (
                    <StyledFileAboveDrag>
                        <PublishIcon style={{fontSize: arrowSize}}/>
                    </StyledFileAboveDrag>
                ) : (
                    <StyledBeforeDrag>
                        <PublishIcon style={{fontSize: arrowSize}}/>
                    </StyledBeforeDrag>
                )
            }
        </div>
    )
};

export default MyDropZone;

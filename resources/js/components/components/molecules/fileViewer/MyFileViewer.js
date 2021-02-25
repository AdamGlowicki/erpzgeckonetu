import React from 'react';
import FileViewer from 'react-file-viewer';
import DraggableModal from "../draggableModal/DraggableModal";

const MyFileViewer = ({extension, file, isOpen, setClose}) => {
    return (
            <DraggableModal handle='main' open={isOpen} setOpen={setClose} >
                <FileViewer
                    fileType={extension}
                    filePath={file}
                />
            </DraggableModal>
    );
};

MyFileViewer.propTypes = {};

export default MyFileViewer;

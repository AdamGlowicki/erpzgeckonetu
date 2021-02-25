import React from 'react';
import Viewer, {Worker} from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import DraggableModal from "../draggableModal/DraggableModal";
import styled from 'styled-components'

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
`

const PreviewPdfFile = ({file, isOpen, setClose}) => {
    const url = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js"
    return (
        <DraggableModal open={isOpen} setOpen={setClose}>
            <Worker workerUrl={url}>
                <div
                    style={{
                        height: '80vh',
                        width: '50vw'

                    }}
                >
                    {file ? (
                        <Viewer fileUrl={file}/>
                    ) : (
                        <StyledWrapper>
                            <div style={{fontSize: '40px'}}>🤷</div>
                            <div className='ml-3'>Brak pliku, usuń referencję.</div>
                        </StyledWrapper>
                    )}
                </div>
            </Worker>
        </DraggableModal>
    );
};

PreviewPdfFile.propTypes = {};

export default PreviewPdfFile;

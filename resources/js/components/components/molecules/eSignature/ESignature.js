import React, {Fragment, useRef, useState} from 'react';
import SignatureCanvas from "react-signature-canvas";
import styled from 'styled-components'
import DraggableModal from "../draggableModal/DraggableModal";
import {ColorButton} from "../../atoms/colorButton/ColorButton";
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import { jsPDF } from "jspdf";

const StyledWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  cursor: url('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/271/pen_1f58a-fe0f.png') 0 120, auto;
`

const StyledContent = styled.div`
  grid-row: 1 / 2;
  background-color: #eee;
`

const StyledButtons = styled.div.attrs({
    className: 'mt-2'
})`
  grid-row: 2 / -1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`


const ESignature = () => {

    const [open, setOpen] = useState(false);
    const [trimmedData, setTrimmedData] = useState(null)
    let sigPad = {};
    const ref = useRef(null);

    const clear = () => {
        sigPad.clear()
    }

    const generatePdf = (imgData) => {
        const doc = new jsPDF()

        const pdf = doc.addImage(imgData, 'PNG', 10, 10, 50, 50, 'monkey')
        console.log(pdf)
        // doc.save('file.pdf')
    }

    const trim = () => {
        // setTrimmedData(sigPad.getTrimmedCanvas().toDataURL('image/png'))
        generatePdf(sigPad.getTrimmedCanvas().toDataURL('image/png'))
    }
    return (
        <Fragment>

            <button onClick={() => setOpen(!open)}>rob cos</button>

            <DraggableModal open={open} setOpen={setOpen}>
                <StyledWrapper>
                    <StyledContent>
                            <SignatureCanvas
                                // ref={(ref) => sigPad = ref}
                                ref={(ref) => sigPad = ref}
                                penColor='black'
                                canvasProps={{width: 700, height: 300, className: 'sigCanvas'}}
                            />
                    </StyledContent>

                    <StyledButtons>
                        <Button
                            size='small'
                            variant='contained'
                            color="secondary"
                            className='mr-2'
                            onClick={clear}
                            startIcon={<ClearIcon fontSize='small'/>}
                        >
                            Wyczyść
                        </Button>
                        <ColorButton size='small' startIcon={<CreateIcon fontSize='small'/>} onClick={trim}>Zapisz</ColorButton>
                    </StyledButtons>
                </StyledWrapper>
            </DraggableModal>

            {trimmedData
                ? <img style={{width: '300px', height: '300px'}}
                       src={trimmedData}/>
                : null}
        </Fragment>
    );
};

export default ESignature;

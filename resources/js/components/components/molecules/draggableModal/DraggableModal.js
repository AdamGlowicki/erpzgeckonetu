import React, {useEffect, useRef, useState} from 'react';
import styled, {keyframes} from 'styled-components'
import Draggable from 'react-draggable';
import {Resizable} from "re-resizable";
import Modal from '@material-ui/core/Modal';
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import {withStyles} from "@material-ui/core";

const slide = keyframes`
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
`

const StyledContent = styled.div.attrs({
    className: 'p-3'
})`
  background-color: #fff;
  animation: ${slide} 500ms;
  transform-origin: 0 0;
  border-radius: 8px;
  box-shadow: 3px 3px 26px -10px rgba(0,0,0,0.75);
`

const StyledAside = styled.aside`
  flex-grow: 1;
  cursor: move;
  text-align: center;
`

const StyledScrollContent = styled.div`
  overflow: scroll;
  &::-webkit-scrollbar{
  height: 5px;
  width: 5px;
  }
  &::-webkit-scrollbar-track {
  background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
  background: #ac0;
  }
`

const StyledModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const StyledModal = withStyles({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
})(props => <Modal {...props}/>)

const DraggableModal = ({open, setOpen, children}) => {
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <StyledModal
            style={{
                width: '0',
                height: '0',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
            BackdropProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    width: 0,
                    height: 0,
                },
            }}
            open={open}
        >
            <StyledModalContent>
                <Draggable handle='aside'>
                    <Resizable>
                        <StyledContent>
                            <div className='d-flex flex-row'>
                                <StyledAside/>
                                <IconButton size='small' onClick={handleClose} variant="contained" color="secondary">
                                    <CloseIcon fontSize='small'/>
                                </IconButton>
                            </div>
                            <StyledScrollContent>
                                {children}
                            </StyledScrollContent>
                        </StyledContent>
                    </Resizable>
                </Draggable>
            </StyledModalContent>
        </StyledModal>
    );
};

export default DraggableModal;

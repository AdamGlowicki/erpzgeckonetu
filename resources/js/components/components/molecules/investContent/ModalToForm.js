import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import {useSpring, animated} from 'react-spring/web.cjs';
import styled, {keyframes} from 'styled-components'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        animation: `$slide 1000ms`,
        transformOrigin: '0',
        borderRadius: '8px'
    },
    "@keyframes slide": {
        "0%": {
            opacity: 0,
            transform: "scaleX(0)"
        },
        "100%": {
            opacity: 1,
            transform: "scaleY(1)"
        }
    },
}));

const StyledWrapper = styled.div.attrs({
    className: 'pt-4 pr-4 pb-3 pl-4'
})`
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

const Fade = React.forwardRef(function Fade(props, ref) {
    const {in: open, children, onEnter, onExited, ...other} = props;
    const [stateOpen, setstateOpen] = useState(false);
    useEffect(() => {
        setstateOpen(open)
    }, [open])
    const style = useSpring({
        from: {opacity: 0},
        to: {opacity: stateOpen ? 1 : 0},
        onStart: () => {
            if (stateOpen && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!stateOpen && onExited) {
                onExited();
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

const ModalToForm = ({children, open: openModal, setOpenModal, ...props}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(openModal)
    }, [openModal])


    const handleClose = () => {
        setOpenModal(false)
        setOpen(false);
    };

    return (
        <div>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <StyledWrapper>
                            {/*<InvestForm setOpen={handleClose} {...props}/>*/}
                        </StyledWrapper>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

export default ModalToForm;

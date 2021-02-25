import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {blue} from '@material-ui/core/colors';
import Slide from '@material-ui/core/Slide'
import AddMiddleInvestForm from "./AddMiddleInvestForm";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StyledDialog = withStyles({
    root: {
        animation: '$move 1000ms'
    },
    '@keyframes move': {
        from: {opacity: 0},
        to: {opacity: 1}
    }
})((props) => <Dialog {...props}/>)

const DialogToAddMiddleInvest = ({open: dialogOpen, setOpen: setOpenDialog, children}) => {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(dialogOpen)
    }, [dialogOpen])

    const handleClose = () => {
        setOpen(false)
        setOpenDialog(false)
    }

    return (
        <StyledDialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            maxWidth='xl'
        >
            <DialogContent>
                {children}
            </DialogContent>
        </StyledDialog>
    );
}

DialogToAddMiddleInvest.propTypes = {
    setOpen: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default DialogToAddMiddleInvest;

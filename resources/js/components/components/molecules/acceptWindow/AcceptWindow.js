import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import DraggableModal from "../draggableModal/DraggableModal";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    button: {
        margin: theme.spacing(1),
    },
}));


const AcceptWindow = ({open, handleClose, children, handleApproved}) => {
    const classes = useStyles();

    const closeHandler = () => {
        handleClose(false);
    }

    return (
        <DraggableModal
            open={open}
            setOpen={handleClose}
        >
            <div className={classes.paper}>
                <div className='d-flex flex-grow-1 align-items-center ml-5 font-weight-bold'>
                    {children}
                </div>
                <div className='d-flex justify-content-end mt-3'>
                    <Button
                        variant="contained"
                        color="secondary"
                        size='small'
                        onClick={handleApproved}
                        className={classes.button}
                        startIcon={<DeleteIcon/>}
                    >
                        Potwierdź
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        size='small'
                        onClick={closeHandler}
                    >
                        Anuluj
                    </Button>
                </div>
            </div>
        </DraggableModal>
    );
};

export default AcceptWindow;

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import {resetIsErrorIsSuccess} from '../../../common/globalMethods';
import {connect} from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";

const StyledSnackbar = withStyles({
    root: {
        animation: '$move 5s',
    },
    '@keyframes move': {
        '0%': {transform: 'translateY(-50px)', opacity: 0,},
        '10%': {transform: 'translateY(0)', opacity: 1},
        '90%': {transform: 'translateY(0)', opacity: 1},
        '100%': {transform: 'translateY(-50px)', opacity: 0},
    }
})(props => <Snackbar {...props}/>)

const SuccessAlert = ({isSuccess, successMessage, reset}) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(isSuccess);
    }, [isSuccess])

    useEffect(() => {
        const handler = setTimeout(() => {
            setOpen(false);
            reset(false);
        }, 4500)
        return () => {
            clearTimeout(handler)
        }
    }, [isSuccess])

    return (
        <StyledSnackbar
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            open={open}
            onClose={() => setOpen(false)}
        >
            <MuiAlert severity='success'>{successMessage}</MuiAlert>
        </StyledSnackbar>
    );
};

const mapDispatchToProps = dispatch => ({
    reset: data => dispatch(resetIsErrorIsSuccess(data))
});

const mapStateToProps = ({investments: {isSuccess, successMessage}}) => ({
    isSuccess, successMessage
});

SuccessAlert.propTypes = {
    isSuccess: PropTypes.bool,
    successMessage: PropTypes.string,
    reset: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(SuccessAlert);

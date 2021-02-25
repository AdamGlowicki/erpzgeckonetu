import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import {resetIsErrorIsSuccess} from '../../../common/globalMethods';
import styled, {keyframes} from "styled-components";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const move = keyframes`
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  20% {transform: translateY(0); opacity: 1}
  40% {transform: translateY(0); opacity: 1}
  60% {transform: translateY(0); opacity: 1}
  100% {transform: translateY(-50px); opacity: 0}
`

const StyledSnackbar = styled(Snackbar)`
  animation: ${move} 5s linear;
`

const FailAlert = ({isError, errorMessage, reset}) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(isError);
    }, [isError])

    useEffect(() => {
        const handler = setTimeout(() => {
            setOpen(false);
            reset(false);
        }, 4500)
        return () => {
            clearTimeout(handler)
        }
    }, [isError])


    return (
        <StyledSnackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={open}
            onClose={() => setOpen(false)}
            message={errorMessage}
        >
            <MuiAlert severity='error'>{errorMessage}</MuiAlert>
        </StyledSnackbar>
    );
};

const mapStateToProps = ({investments: {isError, errorMessage}}) => ({
    isError, errorMessage
});

const mapDispatchToProps = dispatch => ({
    reset: data => dispatch(resetIsErrorIsSuccess(data))
});

FailAlert.propTypes = {
    isError: PropTypes.bool,
    errorMessage: PropTypes.string,
    reset: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(FailAlert);

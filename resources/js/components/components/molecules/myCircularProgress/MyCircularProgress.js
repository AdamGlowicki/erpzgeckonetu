import React, {useEffect, useState} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal';
import {connect} from 'react-redux';

const styledCircle = makeStyles({
    root: {
        color: 'rgb(155, 192, 0)',
        position: 'fixed',
        top: '50%',
        left: '50%',
    }
});

const MyCircularProgress = ({isLoading = false}) => {

    const [stateIsLoading, setStateIsLoading] = useState(false);
    const circle = styledCircle();

    useEffect(() => {
        setStateIsLoading(isLoading)
    }, [isLoading])
    return (
        <Modal
            open={stateIsLoading}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <CircularProgress size={30} className={circle.root}/>
        </Modal>
    );
};

const mapStateToProps = ({investments: {isLoading}}) => ({
    isLoading,
});

MyCircularProgress.propTypes = {
    isLoading: PropTypes.bool,
};

export default connect(mapStateToProps)(MyCircularProgress);

import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import {animated, useSpring} from 'react-spring/web.cjs';
import {CLOSE_MODAL, UPDATE_MINI_NOTE, UPDATE_NAME} from '../../../reducers/investments/duck/reduxType';
import {connect, useSelector} from 'react-redux';
import Input from '@material-ui/core/Input';
import SelectStatus from '../../atoms/selectStatus/SelectStatus';
import CellDetailWindow from '../../molecules/cellDetailWindow/CellDetailWindow';
import styled from 'styled-components';
import ContextToEdit from '../../molecules/contextMenus/contexMenuToEditName/ContextToEdit';
import {clickOutsideHandler} from '../../support/closeByClickOutside/clickOutsideHandler';
import {setError, setLoading, setSuccess} from '../../../common/globalMethods';
import {patchData} from '../../../common/apiMethods/apiMethods';
import MyCircularProgress from '../../molecules/myCircularProgress/MyCircularProgress';
import SuccessAlert from '../../molecules/alerts/SuccessAlert';
import FailAlert from '../../molecules/alerts/FailAlert';
import {useCookies} from "react-cookie";
import {useHistory, useParams, useRouteMatch} from "react-router";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'scroll'
    },
    paper: {
        backgroundColor: 'whitesmoke',
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '800px',
        minWidth: '60vw',
        overflow: 'scroll',
        animation: '$slide 1000ms',
        transformOrigin: '100% 0',
        maxWidth: '90vw',
        '&::-webkit-scrollbar': {
            height: '5px',
            width: '5px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#ac0',
        },
    },
    '@keyframes slide': {
        from: {transform: 'scaleX(0)'},
        to: {transform: 'scaleX(1)'},
    }
}));

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
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

const setName = (data) => ({
    type: UPDATE_NAME,
    payload: data
});

const handleClose = () => ({type: CLOSE_MODAL});

const updateMiniNote = (data) => ({
    type: UPDATE_MINI_NOTE,
    payload: data
});

const StyledInput = styled.div.attrs({
    className: 'ml-4'
})`
  width: 150px;
`;

const SpringModal = ({setTitle, updateMiniNote, setLoading, setError, setSuccess}) => {
    const [cookies, setCookie] = useCookies(['name'])

    const {stageId: paramStageId, taskId: paramTaskId} = useParams()

    const stageId = parseInt(paramStageId);
    const taskId = parseInt(paramTaskId);

    const stageData = useSelector(state => state.investments.mainStage)
    const [task, setTask] = useState({})

    const [name, setName] = useState('');
    const [backupName, setBackupName] = useState('');


    const [isDisable, setDisable] = useState(true);
    const [mini_note, setMiniNote] = useState('');
    const [backupMiniNote, setBackupMiniNote] = useState('');

    const classes = useStyles({close: open});

    const inputRef = useRef(null);

    const history = useHistory();

    useEffect(() => {
        if (stageData.length) {
            const data = stageData.filter(item => item.id === stageId)[0]
            if (!data) {
                history.push('/react/404')
            } else {
                const task = data.tasks.filter(item => item.id === taskId)[0]
                if (!task) {
                    history.push('/react/404')
                } else {
                    setTask(task)

                    setBackupName(task.name)
                    setName(task.name);

                    setBackupMiniNote(task.mini_note);
                    setMiniNote(task.mini_note);
                }
            }
        }
    }, [stageData]);

    const closeModal = () => {
        history.push('/react/invest')
    };

    const asyncUpdateName = async () => {
        setLoading(true);
        try {
            if (!name.length) throw new Error('Empty name');
            await patchData(`/task/${taskId}`, {name}, cookies);
            setTitle({stageId, id: taskId, value: name})
            setSuccess({isSuccess: true, successMessage: `Udało Ci sie poprawnie zmienić nazwę na ${name}`})
        } catch (e) {
            setLoading(false)
            setError({
                isError: true,
                errorMessage: e.message === 'Empty name' ? 'Nazwa nie może byc pusta.' : 'Zmiana nazwy nie powiodła się.'
            })
            setName(backupName);
        }
        setLoading(false)
    };

    const asyncHandleMiniNote = async () => {
        setLoading(true);
        try {
            await patchData(`/task/${taskId}`, {mini_note: mini_note}, cookies);
            updateMiniNote({taskId, stageId, mini_note});
        } catch (e) {
            setLoading(false)
            setError({isError: true, errorMessage: `Nie udało sie zmienić notatki`});
            setBackupMiniNote(backupMiniNote);
        }
        setLoading(false)
    };

    useEffect(() => {
        let handler;
        if (mini_note !== backupMiniNote) {
            handler = setTimeout(asyncHandleMiniNote, 500)
        }
        return () => {
            clearTimeout(handler);
        }
    }, [mini_note]);

    const handleMiniNote = (e) => {
        const {value} = e.target;
        setMiniNote(value);
    };

    const handleSetTitle = e => {
        const {value} = e.target;
        setName(value);
    };

    const closeInputHandler = () => {
        if (!isDisable) {
            asyncUpdateName();
            setDisable(true);
        }
    };

    clickOutsideHandler(closeInputHandler, inputRef)

    return (
        <div>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={true}
                onClose={closeModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={true}>
                    <div className={classes.paper}>
                        <div className='d-flex flex-row justify-content-between mb-3'>
                            <div className='d-flex align-items-center'>
                                <ContextToEdit setDisable={setDisable}>
                                    <Input
                                        ref={inputRef}
                                        disabled={isDisable}
                                        onChange={handleSetTitle}
                                        style={{fontWeight: 'bold'}}
                                        disableUnderline
                                        value={name}
                                        inputProps={{'aria-label': 'description'}}
                                    />
                                </ContextToEdit>
                                <StyledInput>
                                    <Input
                                        onChange={handleMiniNote}
                                        style={{fontWeight: 'bold'}}
                                        value={mini_note}
                                        inputProps={{'aria-label': 'description'}}/>
                                </StyledInput>
                            </div>
                            <SelectStatus stageId={stageId} {...task}/>
                        </div>
                        <div>
                            <CellDetailWindow stageId={stageId} {...task}/>
                        </div>
                    </div>
                    <MyCircularProgress/>
                    <SuccessAlert/>
                    <FailAlert/>
                </Fade>
            </Modal>
        </div>
    );
};

SpringModal.propTypes = {
    modalData: PropTypes.object,
};

SpringModal.defaultProps = {
    modalData: {
        name: ''
    },
    isOpenModal: false,
};

const mapDispatchToProps = dispatch => ({
    handleClose: () => dispatch(handleClose()),
    setTitle: (data) => dispatch(setName(data)),
    updateMiniNote: data => dispatch(updateMiniNote(data)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
    setSuccess: data => dispatch(setSuccess(data)),
});

SpringModal.propTypes = {
    isOpenModal: PropTypes.bool,
    modalData: PropTypes.object,
    handleClose: PropTypes.func,
    setTitle: PropTypes.func,
    updateMiniNote: PropTypes.func,
    setLoading: PropTypes.func,
    setError: PropTypes.func,
    setSuccess: PropTypes.func,
}

export default connect(null, mapDispatchToProps)(SpringModal);

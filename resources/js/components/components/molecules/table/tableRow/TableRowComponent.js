import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles} from '@material-ui/core/styles';
import SelectTableStatus from '../../../atoms/selectTableStatus/SelectTableStatus';
import {mapJsonToMyVariables, setError, setLoading} from '../../../../common/globalMethods';
import {
    ADD_COLUMN,
    DELETE_TABLE_ROW, GET_DATA, IS_ERROR, IS_LOADING,
    SELECT_STATUS_IN_TABLE,
} from '../../../../reducers/investments/duck/reduxType';
import {useDispatch, useSelector} from 'react-redux';
import {DragTypes} from '../../../../enums/dragTypes';
import {TableDate} from '../../../../enums/table/tableDate';
import {AgreementsStatus} from '../../../../enums/table/agreementsStatus';
import {TableName} from '../../../../enums/table/tableName';
import IconButton from '@material-ui/core/IconButton';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import AcceptWindow from '../../acceptWindow/AcceptWindow';
import {TableStatusType} from '../../../../enums/table/tableStatusType';
import {TableAllFilesType} from '../../../../enums/table/tableAllFilesType';
import {deleteData, getData, patchData} from '../../../../common/apiMethods/apiMethods';
import {useCookies} from "react-cookie";
import NoteInTable from "./NoteInTable";
import PostFile from "./PostFile";
import FilesWitchCheckbox from "./FilesWitchCheckbox";
import Date from "./Date";
import {FilePlace} from "../../../../enums/files/filePlace";
import SecondPostFile from "./SecondPostFile";
import {createSelector} from 'reselect'

const useStyles = makeStyles(theme => ({
    root: {
        border: 0,
        color: 'black',
        height: '300px',
        padding: '0 30px',

    },
    animated: {
        fontSize: '10px',
        width: '84%'
    },
    smallSize: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        background: ({background}) => background,
    }
}));

const useStyledSelect = makeStyles(theme => ({
    smallSize: {
        background: ({background}) => background,
    }
}));

const styledTableRow = makeStyles(theme => ({
    root: {
        borderTop: '2px solid rgb(155,192,0)',
        borderBottom: '2px solid rgb(155,192,0)',
    }
}));


const TableRowComponent = ({row, type, stageId, taskId,}) => {

    let {
        id, all_files, status, prev_files, post_files,
        send_date, receive_date, title, second_files,
        second_date, is_all_second_files, second_status,
        is_second_table, second_post_files, post_second_date,
        email_user_id, second_email_user_id
    } = row;

    const [cookies, setCookie] = useCookies(['name'])

    const [stateStatus, setStatus] = useState('');
    const [rowColor, setRowColor] = useState('');
    const [secondRowColor, setSecondRowColor] = useState('')
    const [isOpenAcceptWindow, setOpenAcceptWindow] = useState(false);

    const [openStateSecondTable, setOpenSecondTable] = useState(false);
    const [stateSecondStatus, setStateSecondStatus] = useState('');

    const dispatch = useDispatch()

    const name = useSelector(state => state.investments.mainStage.length && (
        state.investments.mainStage.filter(item => item.id === stageId)[0].tasks.filter(item => item.id === taskId)[0].name
    ))

    const classes = useStyles({background: rowColor});
    const secondTableBackground = useStyles({background: secondRowColor});
    const styledRow = styledTableRow();
    const styledSelect = useStyledSelect({background: rowColor});

    const setTableRowColor = (status) => {
        switch (status) {
            case AgreementsStatus.UNDEFINED:
                return 'white';
            case AgreementsStatus.DISAGREE:
                return 'rgba(251,23,27,0.3)';
            case AgreementsStatus.AGREE:
                return 'rgba(27,251,23,0.3)';
        }
    };

    useEffect(() => {
        is_second_table ? is_second_table = true : is_second_table = false;
        setStatus(status);
        setRowColor(setTableRowColor(status));
        setOpenSecondTable(is_second_table);
        setStateSecondStatus(second_status);
        setSecondRowColor(setTableRowColor(second_status));
    }, [row]);

    const asyncSetStatus = async (value) => {
        dispatch(setLoading(true));
        try {
            await patchData(`/body/${id}`, {status: value}, cookies);
            dispatch({
                type: SELECT_STATUS_IN_TABLE,
                payload: {value, type: TableStatusType.MAIN, rowId: id, stageId, taskId}
            });
            setRowColor(setTableRowColor(value));
        } catch (e) {
            dispatch(setLoading(false));
            dispatch({isError: true, errorMessage: `Nie udalo się zmienić statusu na ${value}`});
            setStatus(status);
            setRowColor(setTableRowColor(status));
        }
        dispatch(setLoading(false));
    };

    const handleSetStatus = (e) => {
        const {value} = e.target;
        setStatus(value);
        asyncSetStatus(value)
    };

    const asyncSetSecondStatus = async (value) => {
        dispatch(setLoading(true));
        try {
            await patchData(`/body/${id}`, {second_status: value, status: value}, cookies);
            dispatch({
                type: SELECT_STATUS_IN_TABLE,
                payload: {value, type: TableStatusType.SECOND, rowId: id, stageId, taskId}
            });
            setStatus(value);
            dispatch({
                type: SELECT_STATUS_IN_TABLE,
                payload: {value, type: TableStatusType.MAIN, rowId: id, stageId, taskId}
            });
            setRowColor(setTableRowColor(value));
            setSecondRowColor(setTableRowColor(value))
        } catch (e) {
            dispatch(setLoading(false));
            dispatch({
                type: IS_ERROR,
                payload: {isError: true, errorMessage: `Nie udalo się zmienić statusu na ${value}`}
            });
            setStateSecondStatus(second_status);
            setRowColor(setTableRowColor(status));
            setSecondRowColor(setTableRowColor(second_status))
        }

        dispatch(setLoading(false));
    };

    const handleSetSecondStatus = (e) => {
        const {value} = e.target;
        setStateSecondStatus(value);
        asyncSetSecondStatus(value)
    };

    const asyncDeleteRow = async () => {
        dispatch(setLoading(true));

        try {
            await deleteData(`/body/${id}`, cookies)
            const result = await getData('/invest', cookies)
            dispatch({type: GET_DATA, payload: {data: mapJsonToMyVariables(result.data)}})
        } catch (e) {
            dispatch(setLoading(false));
            dispatch({type: IS_ERROR, payload: {isError: true, errorMessage: 'Nie udało się usunąć wiersza.'}})
        }
        dispatch(setLoading(false));
    };

    const asyncAddColumn = async () => {
        dispatch(setLoading(true));

        try {
            await patchData(`/body/${id}`, {is_second_table: !openStateSecondTable}, cookies);
            dispatch({type: ADD_COLUMN, payload: {rowId: id, value: !openStateSecondTable, stageId, taskId}});
            setOpenSecondTable(!openStateSecondTable);
        } catch (e) {
            dispatch(setLoading(false));
            dispatch({type: IS_ERROR, payload: {isError: true, errorMessage: 'Nie udało się dodać dodatkowej tabeli.'}})
        }
        dispatch(setLoading(false));
    };

    return (
        <React.Fragment>
            <TableRow key={id} className={styledRow.root}>
                <TableCell className={classes.smallSize}>
                    <Tooltip title='Usuń wiersz'>
                        <IconButton aria-label="delete" color={'secondary'} onClick={() => setOpenAcceptWindow(true)}>
                            <DeleteSweepIcon/>
                        </IconButton>
                    </Tooltip>
                </TableCell>
                <NoteInTable
                    stageId={stageId}
                    taskId={taskId} title={title}
                    rowColor={rowColor}
                    id={id}
                />

                <FilesWitchCheckbox
                    emailKey='email_user_id'
                    id={id}
                    taskName={name}
                    prev_files={prev_files}
                    rowColor={rowColor}
                    all_files={all_files}
                    dragType={DragTypes.PREV_FILES_ON_TABLE}
                    formDataKey='prev' url='/prevFile'
                    checkKey='all_files'
                    checkPosition={TableAllFilesType.MAIN}
                    place={FilePlace.TABLE_PREV}
                    stageId={stageId}
                    taskId={taskId}
                    user_id={email_user_id}
                />

                <Date
                    id={id}
                    rowColor={rowColor}
                    actionType={TableDate.SEND}
                    dataKey='send_date'
                    date={send_date}
                    taskId={taskId}
                    stageId={stageId}
                />

                {type !== TableName.CABLE_LINE && (
                    <React.Fragment>
                        <PostFile
                            id={id}
                            rowColor={rowColor}
                            post_files={post_files}
                            taskName={name}
                            stageId={stageId}
                            taskId={taskId}
                        />

                        <Date stageId={stageId}
                              taskId={taskId}
                              id={id}
                              rowColor={rowColor}
                              actionType={TableDate.PICK}
                              dataKey='receive_date'
                              date={receive_date}
                        />

                    </React.Fragment>
                )}

                <TableCell className={styledSelect.smallSize}>
                    <SelectTableStatus
                        status={stateStatus}
                        handleStatus={handleSetStatus}
                    />
                </TableCell>
                <TableCell padding='none'>
                    <IconButton size='small' onClick={asyncAddColumn}>
                        <AddIcon/>
                    </IconButton>
                </TableCell>

                {openStateSecondTable && (
                    <React.Fragment>
                        <FilesWitchCheckbox
                            dragType={DragTypes.SECOND_FILES_ON_TABLE}
                            id={id}
                            rowColor={secondRowColor}
                            prev_files={second_files}
                            all_files={is_all_second_files}
                            formDataKey='second' url='/secondFile'
                            checkKey='is_all_second_files'
                            checkPosition={TableAllFilesType.SECOND}
                            place={FilePlace.TABLE_SECOND}
                            taskName={name}
                            stageId={stageId}
                            taskId={taskId}
                            emailKey='second_email_user_id'
                            user_id={second_email_user_id}
                        />

                        <Date
                            id={id}
                            rowColor={secondRowColor}
                            actionType={TableDate.SECOND}
                            dataKey='second_date'
                            date={second_date}
                            stageId={stageId}
                            taskId={taskId}
                        />

                        <SecondPostFile
                            id={id}
                            rowColor={secondRowColor}
                            files={second_post_files}
                            taskName={name}
                            stageId={stageId}
                            taskId={taskId}
                        />

                        <Date
                            id={id}
                            rowColor={secondRowColor}
                            actionType={TableDate.SECOND}
                            dataKey='post_second_date'
                            date={post_second_date}
                            stageId={stageId}
                            taskId={taskId}
                        />

                        <TableCell
                            className={secondTableBackground.smallSize}
                        >
                            <SelectTableStatus
                                status={stateSecondStatus}
                                handleStatus={handleSetSecondStatus}
                                rowId={id}
                            />
                        </TableCell>
                    </React.Fragment>
                )}
                <TableCell>
                    <AcceptWindow
                        handleApproved={asyncDeleteRow}
                        handleClose={setOpenAcceptWindow}
                        open={isOpenAcceptWindow}
                    >
                        Czy na pewno chcesz usunąć wiersz?
                    </AcceptWindow>
                </TableCell>

            </TableRow>
        </React.Fragment>
    );
};

TableRowComponent.propTypes = {
    row: PropTypes.object,
    setFirstColumn: PropTypes.func,
    setDate: PropTypes.func,
    updateCheckbox: PropTypes.func,
    selectStatus: PropTypes.func,
    deleteRow: PropTypes.func,
    addColumn: PropTypes.func,
    updateSecondDate: PropTypes.func,
};

export default TableRowComponent;

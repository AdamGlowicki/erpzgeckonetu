import React, {Fragment, useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableRowComponent from './tableRow/TableRowComponent';
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import {ADD_TABLE_ROW, DELETE_TABLE, GET_DATA, SET_TITLE_TABLE} from '../../../reducers/investments/duck/reduxType';
import {connect, useDispatch} from 'react-redux';
import AcceptWindow from '../acceptWindow/AcceptWindow';
import ActionTableIcons from './actionIcons/ActionTableIcons';
import styled from 'styled-components'
import {TableName} from '../../../enums/table/tableName';
import {rowConst} from '../../../enums/table/rowConsts';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import ContextToEdit from '../contextMenus/contexMenuToEditName/ContextToEdit';
import {clickOutsideHandler} from '../../support/closeByClickOutside/clickOutsideHandler';
import {mapJsonToMyVariables, setError, setLoading} from '../../../common/globalMethods';
import {deleteData, getData, patchData, postData} from '../../../common/apiMethods/apiMethods';
import {AgreementsStatus} from '../../../enums/table/agreementsStatus';
import {useCookies} from "react-cookie";
import {arrangements, cableLine, seizeRoad, toPd} from "../../../enums/table/headCells";

const useStyles = makeStyles({
    table: {
        width: 100,
    },
    root: {
        fontSize: 10,
    },
});

const typographyStyle = makeStyles({
    title: {
        marginLeft: '30px',
    }
});

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const setTitleTable = (data) => ({
    type: SET_TITLE_TABLE,
    payload: data
});

const deleteTable = payload => ({
    type: DELETE_TABLE,
    payload,
});

const addRow = (payload) => ({
    type: ADD_TABLE_ROW,
    payload,
});

const sortByAgree = (array) => {
    const agree = array.filter(item => item.status === AgreementsStatus.AGREE);
    const other = array.filter(item => item.status !== AgreementsStatus.AGREE);
    return [...other, ...agree]
};

const calculatePercent = (array = []) => {
    const agree = array ? array.filter(item => item.status === AgreementsStatus.AGREE) : [];

    return ((agree.length / array.length) * 100).toFixed(2)
}

const TableComponent = ({table, id, stageId, setTitleTable, deleteTable, setError, setLoading,}) => {
    const classes = useStyles();
    const [openApprovedWindow, setOpenApprovedWindow] = useState(false);
    const [disableTitle, setDisableTitle] = useState(true);

    const [backupTableTitle, setBackupTableTitle] = useState('');
    const [tableTitle, setTableTitle] = useState('');

    const [additionalHeaders, setAdditionalHeaders] = useState(false);

    const [cookies, ] = useCookies(['name']);

    const dispatch = useDispatch();

    useEffect(() => {
        setBackupTableTitle(table.title)
        setTableTitle(table.title);
    }, [table]);

    const titleRef = useRef(null);

    const handleSetTitle = (e) => {
        const {value} = e.target;
        setTableTitle(value)
    };

    const handleDeleteTable = () => {
        setOpenApprovedWindow(true);
    };

    const checkIfAdditionalHeaders = () => {
        if (table.body) {
            const rowWithSecondTable = table.body.filter(item => item.is_second_table);

            if (rowWithSecondTable.length) {
                setAdditionalHeaders(true);
            } else {
                setAdditionalHeaders(false)
            }
        }
    }

    useEffect(() => {
        checkIfAdditionalHeaders()
    })

    const asyncDeleteTable = async () => {
        setLoading(true);
        try {
            await deleteData(`/table/${table.id}`, cookies);
            deleteTable({id, stageId});
        } catch (e) {
            setLoading(false)
            setError({isError: true, errorMessage: `Nie udało sie usunąć tabeli.`})
        }
        setLoading(false)
        setOpenApprovedWindow(false)
    };

    const asyncAddRow = async () => {
        console.log('dadadasda')
        setLoading(true);
        try {
            const rightTable = table.type === TableName.CABLE_LINE ? rowConst(table.id).LINE_CABLE : rowConst(table.id).OTHER
            await postData('/body', rightTable, cookies);
            const response = await getData('/invest', cookies)
            dispatch({type: GET_DATA, payload: {data: mapJsonToMyVariables(response.data)}})
        } catch (e) {
            console.log(e)
            setLoading(false)
            setError({isError: true, errorMessage: 'Nie udało się dodac nowego wiersza'})
        }
        setLoading(false)
    };

    const asyncUpdateTitle = async () => {
        setLoading(true);
        try {
            await patchData(`/table/${table.id}`, {title: tableTitle}, cookies);
            setTitleTable({tableTitle, id, stageId})
        } catch (e) {
            setLoading(false)
            setError({isError: true, errorMessage: `Nie udało się zienić tytułu na ${tableTitle}`});
            setTableTitle(backupTableTitle)
        }
        setLoading(false);
    };

    const closeInputHandler = async () => {
        if (!disableTitle) {
            await asyncUpdateTitle();
            setDisableTitle(true);
        }
    };

    const getTableHeaders = (type) => {
        switch (type) {
            case TableName.ARRANGEMENTS:
                return arrangements;
            case TableName.CABLE_LINE:
                return cableLine;
            case TableName.ROUTE_TO_PD:
                return toPd;
            case TableName.SEIZE_STREET:
                return seizeRoad;
        }
    }

    clickOutsideHandler(closeInputHandler, titleRef);

    return (
        <StyledWrapper>
            <Typography className={typographyStyle().title} variant="h6" id="tableTitle" component="div">
                <div className='d-flex flex-row justify-content-between'>
                    <ContextToEdit setDisable={() => setDisableTitle(false)}>
                        <Input
                            ref={titleRef}
                            disabled={disableTitle}
                            onChange={handleSetTitle}
                            style={{fontWeight: 'bold'}}
                            disableUnderline
                            value={tableTitle}
                            inputProps={{'aria-label': 'description'}}/>
                    </ContextToEdit>
                    <ActionTableIcons handleAddRow={asyncAddRow} handleDeleteTable={handleDeleteTable}
                                      percent={calculatePercent(table.body)}/>
                </div>
            </Typography>
            <TableContainer component={Paper}>
                <Table size='small' className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow key={table.type}>
                            <TableCell className={classes.root} align='center' size='small'>
                                <DeleteSweepIcon/>
                            </TableCell>
                            {table.type && getTableHeaders(table.type).map(item => <TableCell className={classes.root}
                                                                                              align='center'
                                                                                              size='small'
                                                                                              key={item.id}>{item.label}</TableCell>)}
                            {additionalHeaders && (
                                <Fragment>
                                    <TableCell className={classes.root} align='center' size='small'></TableCell>
                                    <TableCell className={classes.root} align='center'
                                               size='small'>Załączniki</TableCell>
                                    <TableCell className={classes.root} align='center' size='small'>Wysłane</TableCell>
                                    <TableCell className={classes.root} align='center'
                                               size='small'>Załączniki</TableCell>
                                    <TableCell className={classes.root} align='center' size='small'>Odebrane</TableCell>
                                    <TableCell className={classes.root} align='center' size='small'>Status</TableCell>
                                </Fragment>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {table.body && sortByAgree(table.body).map(row => (
                            <TableRowComponent stageId={stageId} taskId={id} key={row.id} row={row} type={table.type}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <React.Fragment>
                <AcceptWindow
                    open={openApprovedWindow}
                    handleClose={setOpenApprovedWindow}
                    handleApproved={asyncDeleteTable}
                >
                    Czy na pewno chcesz usunąć tabelę?
                </AcceptWindow>
            </React.Fragment>
        </StyledWrapper>
    );
};

TableComponent.prototype = {
    table: PropTypes.object,
    setTitleTable: PropTypes.func,
    deleteTable: PropTypes.func,
};

TableComponent.defaultProps = {
    table: {
        head: [],
    }
};

const mapDispatchToProps = dispatch => ({
    setTitleTable: (data) => dispatch(setTitleTable(data)),
    deleteTable: (data) => dispatch(deleteTable(data)),
    addRow: (data) => dispatch(addRow(data)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
});

TableComponent.propTypes = {
    setTitleTable: PropTypes.func,
    deleteTable: PropTypes.func,
    addRow: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(TableComponent);

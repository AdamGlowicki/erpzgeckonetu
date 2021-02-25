import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {InvestHeads} from "../../../enums/investHead/investHead";

const useStyles = makeStyles({
    root: {
        width: '100%',
        border: 'none',
        boxShadow: 'none'
    },
    container: {
        maxHeight: 440,
        border: 'none',
        boxShadow: 'none'
    },
});

const cellStyle = makeStyles({
    root: {
        fontSize: '14px',
        background: 'white',
        border: 'none',
        padding: '8px',
        borderBottom: '1px solid black'
    }
});


const InvestTableInfo = ({stage: {country, adder, deadline, tech}}) => {
    const classes = useStyles();
    const cell = cellStyle();
    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {InvestHeads.map((column) => (
                                <TableCell
                                    className={cell.root}
                                    key={column.id}
                                    align='center'
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{fontSize: '12px'}} align='center'>
                                {country}
                            </TableCell>
                            <TableCell style={{fontSize: '12px'}} align='center'>
                                {adder}
                            </TableCell>
                            <TableCell style={{fontSize: '12px'}} align='center'>
                                {deadline}
                            </TableCell>
                            <TableCell style={{fontSize: '12px'}} align='center'>
                                {tech}
                            </TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

InvestTableInfo.propTypes = {};

export default InvestTableInfo;

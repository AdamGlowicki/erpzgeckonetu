import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const StyledTableCell = withStyles({
    root: {
        paddingTop: '8px',
        paddingBottom: '8px',
    }
})((props) => <TableCell {...props}/>)

const StyledTableRow = withStyles({
    root: {
        animation: '$slide 1000ms',
        transformOrigin: '0'
    },
    '@keyframes slide': {
        from: {transform: 'scaleX(0)'},
        to: {transform: 'scaleX(1)'},
    }
})((props) => <TableRow {...props}/>)


const AddedItems = ({item: {item: {model_name, descr, unit: {short_name}}, quantity, quantity_used,},}) => {
    return (
        <StyledTableRow>
            <StyledTableCell component="th" scope="row"/>
            <StyledTableCell scope="row">
                <div></div>
            </StyledTableCell>
            <StyledTableCell scope="row">
                <div>{model_name ? model_name : ''}</div>
            </StyledTableCell>
            <StyledTableCell align='center' scope="row">
                <div>{quantity}</div>
            </StyledTableCell>
            <StyledTableCell align='center' scope="row">
                <div>{quantity_used}</div>
            </StyledTableCell>
            <StyledTableCell align='center' scope="row">
                <div>{short_name}</div>
            </StyledTableCell>
            <StyledTableCell scope="row">
                <div>{descr}</div>
            </StyledTableCell>
        </StyledTableRow>
    );
};

export default AddedItems;

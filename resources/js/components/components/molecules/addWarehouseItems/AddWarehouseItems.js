import React, {useReducer, useState} from 'react';
import WarehouseItem from "./WarehouseItem";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {withStyles} from "@material-ui/core/styles";
import AddedItems from "../warehouse/AddedItems";
import {useDispatch} from "react-redux";
import {addItemToWarehouse} from "../../../reducers/watehouseInvestment/duck/actions";

const StyledTableCell = withStyles({
    root: {
        paddingTop: '8px',
        paddingBottom: '8px',
    }
})((props) => <TableCell {...props}/>)

const AddWarehouseItems = ({items, newItems, setNewItems}) => {
    const [id, setId] = useState(1);

    const handleAddNewRow = () => {
        setNewItems([...newItems, {id, supply: false, item: {}, quantity: 0, }])
        setId(id + 1)
    }

    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <colgroup>
                        <col width="5%" />
                        <col width="5%" />
                        <col width="30%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="30%" />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'></StyledTableCell>
                            <StyledTableCell align='center'>ZAP</StyledTableCell>
                            <StyledTableCell align='center'>Produkt</StyledTableCell>
                            <StyledTableCell align='center'>ILOŚĆ PlAN.</StyledTableCell>
                            <StyledTableCell align='center'>ILOŚĆ UŻYTA</StyledTableCell>
                            <StyledTableCell align='center'>J.M na 100%</StyledTableCell>
                            <StyledTableCell align='center'>KOMENTARZ</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items && items.map(item => (<AddedItems key={item.id} item={item}/>))}
                        {newItems && newItems.map(item => <WarehouseItem key={item.id} newItems={newItems} setNewItems={setNewItems} {...item}/>)}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className='d-flex justify-content-end mt-3 mr-2'>
                <Button onClick={handleAddNewRow} style={{background: 'darkslategray', color: 'white'}}>Dodaj pozycje</Button>
            </div>
        </React.Fragment>
    );
};

export default AddWarehouseItems;

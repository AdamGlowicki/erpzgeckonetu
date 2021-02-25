import React, {useCallback, useEffect, useReducer, useState} from 'react';
import InputText from "../../atoms/inputText/InputText";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {useCookies} from "react-cookie";
import AsyncSelect from "../../atoms/ayncSelect/AsyncSelect";
import styled from 'styled-components';

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
            animation: '$opacity 1000ms'
        },
    },
    checked: {},
    '@keyframes opacity': {
        from: {opacity: 0},
        to: {opacity: 1}
    }
})((props) => <Checkbox color="default" {...props} />);

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

const StyledTableCell = withStyles({
    root: {
        paddingTop: 0,
        paddingBottom: '4px',
    },
})((props) => <TableCell {...props}/>)

const StyledNote = styled.div`
  height: 50px;
  font-size: 12px;
  overflow-y: scroll;
  &::-webkit-scrollbar{
  height: 5px;
  width: 5px;
  }
  &::-webkit-scrollbar-track {
  background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
  background: #ac0;
  }
`

const WarehouseItem = ({id, supply, item, quantity, newItems, setNewItems}) => {

    const [selected, setSelected] = useState('')
    const [usedMaterial, setUsedMaterial] = useState({
        unit: '',
        quantity: '',
    });

    const handleCheckbox = (e) => {
        setNewItems([
            ...newItems.map(item => {
                return item.id === id ? {
                    ...item,
                    supply: e.target.checked,
                } : {...item}
            })
        ])
    }

    const handleAsyncSelect = (e, value) => {
        setSelected(value);
        setNewItems([
            ...newItems.map(item => {
                return item.id === id ? {
                    ...item,
                    item: {...value}
                } : {...item}
            })
        ])
    }

    const handleQuantity = (e) => {
        setNewItems([
            ...newItems.map(item => {
                return item.id === id ? {
                    ...item,
                    quantity: e.target.value
                } : {...item}
            })
        ])
    }

    const handleRemoveRow = () => {
        setNewItems([
            ...newItems.filter(item => item.id !== id)
        ])
    }

    return (
            <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                    <IconButton onClick={handleRemoveRow} style={{width: '30px'}} aria-label="delete">
                        <DeleteIcon style={{color: 'red'}} fontSize='small' />
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell align="center">
                    <GreenCheckbox name='supply' checked={supply} onChange={handleCheckbox}/>
                </StyledTableCell>
                <StyledTableCell align="center">
                    <AsyncSelect url={`/item/search`} value={item} setSelected={handleAsyncSelect}/>
                </StyledTableCell>
                <StyledTableCell align='center'>
                    <InputText
                        name='planQuantity'
                        type='number'
                        onChange={handleQuantity}
                        value={quantity}
                        style={{width: '80px'}}
                    >
                    </InputText>
                </StyledTableCell>
                <StyledTableCell align='center'/>
                <StyledTableCell align='center'>
                    {selected && selected.unit.short_name}
                </StyledTableCell>
                <StyledTableCell  align='left'/>
            </StyledTableRow>
    );
};

export default WarehouseItem;

import React, {useEffect, useReducer} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputDate from "../../atoms/inputDate/InputDate";
import styled, {css, keyframes} from "styled-components";
import {useSelector} from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
            display: 'flex',
            flexDirection: 'column',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        width: '25ch',
    },
}));

const shake = keyframes`
  0% {transform: translateX(0);}
  10% {transform: translateX(-10px);}
  20% {transform: translateX(10px);}
  30% {transform: translateX(-10px);}
  40% {transform: translateX(10px);}
  50% {transform: translateX(-10px);}
  60% {transform: translateX(10px);}
  70% {transform: translateX(-10px);}
  80% {transform: translateX(10px);}
  90% {transform: translateX(-10px);}
  100% {transform: translateX(0);}
`

const StyledShake = styled.div`
  ${({error}) => (
    error && css`
          animation: ${shake} .5s linear;
      `
)}
`

const StyledTextField = withStyles({
    root: {
        marginTop: '8px',
        '& label.Mui-focused': {
            color: 'rgb(162,198,0)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'rgb(162,198,0)',
        },
    },
})(TextField);

const WarehouseInputs = ({handleInput, inputsContent, inputValidate, disabled}) => {
    const classes = useStyles();

    const cars = useSelector(state => state.warehouse.cars)
    const warehouses = useSelector(state => state.warehouse.warehouses)


    const [inputsValidate, setInputsValidate] = useReducer(
        (prevState, state) => ({...prevState, ...state})
        , {})

    useEffect(() => {
        setInputsValidate({...inputValidate})
    }, [inputValidate])

    const returnShake = () => {
        for (const [key, value] of Object.entries(inputsValidate)) {
            setInputsValidate({[key]: false})
        }
    }

    useEffect(() => {
        const handler = setTimeout(returnShake, 1000)
        return () => {
            clearTimeout(handler)
        }
    }, [inputsValidate])

    return (
        <React.Fragment>
            <form className={classes.root} noValidate autoComplete="off">
                <StyledShake error={inputsValidate.inv_code}>
                    <StyledTextField
                        disabled={disabled}
                        name='inv_code'
                        id="standard-basic"
                        label='Kod inwestycji (3 znaki)'
                        value={inputsContent.inv_code}
                        onChange={handleInput}
                        required
                        error={inputValidate.inv_code}
                    />
                </StyledShake>

                <StyledShake error={inputsValidate.num_type}>
                    <StyledTextField
                        disabled={disabled}
                        name='num_type'
                        select
                        label='Indeks inwestycji'
                        id="demo-simple-select"
                        value={inputsContent.num_type.toLowerCase()}
                        onChange={handleInput}
                        required
                        error={inputValidate.num_type}
                    >
                        <MenuItem value='z'>Zaciąg</MenuItem>
                        <MenuItem value='u'>Uzbrajanie</MenuItem>
                        <MenuItem value='pz'>Prace ziemne</MenuItem>
                        <MenuItem value='bp'>Budowa przyłącza</MenuItem>
                    </StyledTextField>
                </StyledShake>
                <StyledShake error={inputsValidate.realized}>

                    <StyledTextField
                        name='realized'
                        select
                        label='Realizowane przez'
                        id="demo-simple-select"
                        value={inputsContent.realized}
                        onChange={handleInput}
                        error={inputValidate.realized}
                        required
                    >
                        {cars && cars.map(item => <MenuItem key={item.id} value={item}>{item.name}</MenuItem>)}
                    </StyledTextField>

                </StyledShake>
                <StyledShake error={inputsValidate.warehouse}>

                    <StyledTextField
                        name='warehouse'
                        select
                        label='Magazyn'
                        id="demo-simple-select"
                        value={inputsContent.warehouse}
                        onChange={handleInput}
                        required
                        error={inputValidate.warehouse}
                    >
                        {warehouses && warehouses.map(item => <MenuItem key={item.id}
                                                                        value={item}>{item.name}</MenuItem>)}
                    </StyledTextField>
                </StyledShake>
            </form>

        </React.Fragment>
    );
};


export default WarehouseInputs;

import React, {useEffect, useReducer} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputDate from "../../atoms/inputDate/InputDate";
import TextArea from "../../atoms/textArea/TextArea";
import styled, {css, keyframes} from "styled-components";

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

const BriefcaseInputs = ({handleInput, inputsContent, inputValidate, place}) => {
    const classes = useStyles();

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
                <StyledShake error={inputsValidate.country}>
                    <StyledTextField
                        name='country'
                        id="standard-basic"
                        label='Miejscowość'
                        value={inputsContent.country}
                        onChange={handleInput}
                        required
                        error={inputValidate.country}
                    />
                </StyledShake>
                <StyledShake error={inputsValidate.stage_name}>
                    <StyledTextField
                        name='stage_name'
                        id="standard-basic"
                        label='Nazwa inw. (pow., gmina)'
                        value={inputsContent.stage_name}
                        onChange={handleInput}
                        required
                        error={inputValidate.stage_name}
                    />
                </StyledShake>
                <StyledShake error={inputsValidate.adder}>
                    <StyledTextField
                        name='adder'
                        id="standard-basic"
                        label='Dodał'
                        value={inputsContent.adder}
                        onChange={handleInput}
                        required
                        error={inputValidate.adder}
                    />
                </StyledShake>
                <TextArea
                    name='address'
                    id="standard-basic"
                    label='Adres inwestycji'
                    rows={3}
                    value={inputsContent.address}
                    onChange={handleInput}
                />
                <StyledShake error={inputsValidate.add_date}>
                    <InputDate
                        name='add_date'
                        label='Data dodania'
                        value={inputsContent.add_date}
                        onChange={handleInput}
                        required
                        error={inputValidate.add_date}
                    />
                </StyledShake>
            </form>
        </React.Fragment>
    );
};

export default BriefcaseInputs;

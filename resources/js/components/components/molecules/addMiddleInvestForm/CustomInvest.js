import React, {useReducer, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import InputText from "../../atoms/inputText/InputText";
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        width: '25ch',
    },
}));

const StyledInputs = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 200px;
`

const CustomInvest = ({inputs, handleInputs}) => {
    const classes = useStyles();
    const [generatedInputs, setGeneratedInputs] = useState([]);
    const [number, setNumber] = useState(2);

    const handleAddInput = () => {
        setGeneratedInputs([
            ...generatedInputs, {name: `task${number}`}
        ])
        setNumber(number + 1)
    }

    return (
        <div>
            <form className={classes.root} noValidate autoComplete="off">
                <InputText
                    name='stage_name'
                    label='Podinwestycja'
                    value={inputs.stage_name}
                    onChange={handleInputs}
                />
            </form>
            <form className={classes.root} noValidate autoComplete="off">
                <StyledInputs>
                    <InputText
                        style={{marginLeft: '24px'}}
                        name='task1'
                        label='Etap'
                        value={inputs.task1}
                        onChange={handleInputs}
                    />
                    {generatedInputs.map(input => (
                        <InputText style={{marginLeft: '24px'}}
                                   name={input.name} label='Etap' onChange={handleInputs}/>
                    ))}
                    <IconButton onClick={handleAddInput} aria-label="delete">
                        <AddIcon fontSize='small'/>
                    </IconButton>
                </StyledInputs>
            </form>
        </div>
    );
};

export default CustomInvest;

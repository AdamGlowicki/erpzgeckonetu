import React, {useEffect, useState} from 'react';
import styled, {keyframes, css} from 'styled-components';
import InputText from "../../atoms/inputText/InputText";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import {deleteData, patchData, postData} from "../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {useDispatch} from "react-redux";
import {
    DELETE_DRAWER_INVESTMENT,
    SAVE_DRAWER_INVESTMENT,
    UPDATE_DRAWER_INVESTMENT
} from "../../../reducers/investments/duck/reduxType";
import AcceptWindow from "../acceptWindow/AcceptWindow";

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

const StyledWrapper = styled.section`
  width: 350px;
  height: 200px;
  display: grid;
  grid-template-rows: auto 1fr auto;
`

const StyledHead = styled.div`
  grid-row: 1 / 2;
  display: flex;
  flex-direction: row;
`

const StyledContent = styled.div`
  grid-row: 2 / 3;
`

const StyledTitle = styled.div.attrs({
    className: 'ml-2'
})`
    font-size: 20px;
    font-weight: 600;
`

const Shake = styled.div`
  ${({error}) => (
      error && css`
        animation: ${shake} .5s linear;
      `
)}
`

const StyledButtons = styled.div.attrs({
    className: 'mb-1 mr-1'
})`
  grid-row: 3 / -1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const DrawerForm = ({drawer: {name: drawerName, id}, setClose}) => {

    const [name, setName] = useState('')
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [red, setRed] = useState(false);

    const [cookies, setCookies] = useCookies()

    const saveDrawerToState = useDispatch();
    const updateDrawerToState = useDispatch()
    const deleteDrawerToState = useDispatch()


    useEffect(() => {
        setName(drawerName)
    }, [drawerName])

    useEffect(() => {
        const handler = setTimeout(() => setError(false), 1000)

        return () => {
            clearTimeout(handler)
        }
    }, [error])

    const asyncSaveDrover = async () => {
        try {
            const result = await postData('/drawer', {name}, cookies)
            saveDrawerToState({type: SAVE_DRAWER_INVESTMENT, payload: result.data})
            setClose(false);
        } catch (e) {

        }
    }

    const asyncUpdateDrawer = async() => {
        try {
            const result = await patchData(`/drawer/${id}`, {name}, cookies)
            updateDrawerToState({type: UPDATE_DRAWER_INVESTMENT, payload: {id, name}})
            setClose(false);
        } catch (e) {
            console.log(e)
        }
    }

    const asyncDeleteDrawer = async() => {
        try {
            // const result = await deleteData(`/drawer/${id}`, cookies)
            deleteDrawerToState({type: DELETE_DRAWER_INVESTMENT, payload: id})
            setClose(false);
        } catch (e) {
            console.log(e)
        }
    }

    const handleSave = async() => {
        if (name.length) {
            id ? await asyncUpdateDrawer() : await asyncSaveDrover();
        } else {
            setError(true)
            setRed(true)
        }
    }

    const handleDelete = () => {
        asyncDeleteDrawer();
    }

    return (
        <StyledWrapper>
            <StyledHead>
                <MeetingRoomIcon fontSize='large'/>
                <StyledTitle>
                    {id ? name : 'Dodaj nową szufladę.'}
                </StyledTitle>
            </StyledHead>

            <StyledContent>
                <Shake error={error}>
                    <InputText
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='ml-2 mt-2'
                        label='Nazwa szuflady'
                        error={red}
                        required
                    />
                </Shake>
            </StyledContent>

            <StyledButtons>
                {id && (<Button
                    onClick={() => setOpen(!open)}
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<DeleteIcon fontSize='small'/>}
                >
                    Usuń
                </Button>)}
                <Shake error={error}>
                    <Button
                        onClick={handleSave}
                        className='ml-2'
                        variant="contained"
                        size="small"
                        style={{background: 'yellowgreen'}}
                        startIcon={<SaveIcon fontSize='small'/>}
                    >
                        {id ? 'Aktualizuj' : 'Zapisz'}
                    </Button>
                </Shake>
            </StyledButtons>
            <AcceptWindow
                open={open}
                handleClose={setOpen}
                handleApproved={handleDelete}
            >
                Czy na pewno chcesz usunąć szufladę {name}?
            </AcceptWindow>
        </StyledWrapper>
    );
};

export default DrawerForm;

import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';
import ShakeContent from "../../atoms/shakeContent/ShakeContent";
import InputText from "../../atoms/inputText/InputText";
import {postData} from "../../../common/apiMethods/apiMethods";
import {useDispatch} from "react-redux";
import {turnOffAlert, turnOnAlert} from "../../../reducers/alert/duck/actions";
import {useCookies} from "react-cookie";
import {setError, setSuccess} from "../../../common/globalMethods";

const StyledWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 150px;
  width: 300px;
`

const StyledHead = styled.div.attrs({
    className: 'ml-2'
})`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const StyledButtonContent = styled.div`
  display: flex;
  justify-content: flex-end;
`

const StyledErrorMessage = styled.div`
  font-size: 12px;
  color: red;
`

const ColorButton = withStyles((theme) => ({
    root: {
        marginLeft: ({second}) => second && theme.spacing(1),
        color: 'white',
        backgroundColor: 'rgb(162,198,0)',
        '&:hover': {
            backgroundColor: 'rgb(162,198,100)',
        },
    },
}))((props) => <Button {...props}/>);


const SetTimeForm = ({place, setOpen, body_id, stage_id, folder_id, agreement_folder_id, placeName}) => {
    const [time, setTime] = useState(1);
    const [error, setStateError] = useState(false)
    const [cookies, setCookies] = useCookies()

    const dispatchTurnOnCountdown = useDispatch()
    const dispatchTurnOffCountdown = useDispatch()
    const dispatchError = useDispatch();
    const dispatchSuccessAlert = useDispatch()

    const generateCode = () =>  Math.floor((Math.random() * 1000) + 1)

    const asyncStartTime = async () => {
        const code = generateCode();
        try {
            dispatchTurnOnCountdown(turnOnAlert({time, place, start: true, placeName, code}))
            setOpen(false)
            await postData('/mail/attachments', {time: time, place, body_id, stage_id, folder_id, agreement_folder_id, code,},cookies);
            dispatchTurnOffCountdown(turnOffAlert())
            dispatchSuccessAlert(setSuccess({isSuccess: true, successMessage: `Pobieranie plików zakończone.` }))
        } catch (e) {
            console.log(e.status)
            dispatchTurnOffCountdown(turnOffAlert())
            dispatchError(setError({isError: true, errorMessage: 'Coś poszło nie tak, skontaktuj się z administratorem.'}))
        }
    }

    const handleSetTime = async() => {
        await asyncStartTime()
    }

    const handleTime = (e) => {
        const {value} = {...e.target}
        if (value === '0' || value > 5) {
            setStateError(true)
        } else {
            setStateError(false)
            setTime(value)
        }
    }

    useEffect(() => {
        const handler = setTimeout(() => setStateError(false), 2000);

        return () => {
            clearTimeout(handler)
        }
    }, [error])

    return (
        <StyledWrapper>
            <StyledHead>
                <AccessAlarmsIcon/>
                <div>
                    Ustaw czas przyjmowania plików.
                </div>
            </StyledHead>

            <div>
                <ShakeContent shake={error}>
                    <InputText
                        label='Czas na presłanie pliku.'
                        type='number'
                        value={time}
                        onChange={handleTime}
                        error={error}
                    />
                </ShakeContent>
                {error && (
                    <StyledErrorMessage>
                        Musisz wybrać liczby z zakresu 1 - 5.
                    </StyledErrorMessage>
                )}
            </div>

            <StyledButtonContent>
                <ColorButton onClick={handleSetTime}>
                    Ustaw
                </ColorButton>
            </StyledButtonContent>
        </StyledWrapper>
    );
};

export default SetTimeForm;

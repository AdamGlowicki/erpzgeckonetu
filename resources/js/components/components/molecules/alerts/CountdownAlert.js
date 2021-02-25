import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled, {keyframes} from "styled-components";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Countdown from "react-countdown";
import TimerIcon from '@material-ui/icons/Timer';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {turnOffAlert} from "../../../reducers/alert/duck/actions";

const move = keyframes`
  0% {transform: translateY(-50px); opacity: 0;}
  100% {transform: translateY(0); opacity: 1}
`
const moveOut = keyframes`
  100% {transform: translateY(-50px); opacity: 0;}
  0% {transform: translateY(0); opacity: 1}
`

const StyledSnackbar = styled(Snackbar)`
  animation: ${props => props.animation ? move : moveOut} 1000ms linear;
`

const StyledTimer = styled.div`
  font-size: 16px;
`

const StyledAlertContent = styled.div`
  color: white;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const CountdownAlert = () => {
    const [open, setOpen] = useState(false);
    const [render, setRender] = useState(false)
    const [time, setTime] = useState(0);
    const [placeName, setPlaceName] = useState('');
    const [code, setCode] = useState('');

    const countdown = useSelector(state => state.alerts.scan)
    const dispatchTurnOff = useDispatch();

    useEffect(() => {
        if (countdown) {
            let {start, time, placeName, code} = countdown;
            !time && (time = 12000);
            time = time * 60000
            setOpen(start);
            setTime(time)
            setPlaceName(placeName)
            setCode(code)
        }
    }, [countdown])

    useEffect(() => {
        if (open) setRender(true)
    }, [open])

    useEffect( () => {
        const handler = setTimeout(() => {

            setOpen(false);
        }, time)
        return () => {
            clearTimeout(handler)
        }
    }, [time])

    const handleCloseAlert = async (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const format = ({minutes, seconds}) => {
        const formatMinutes = minutes <= 9 ? `0${minutes}` : minutes
        const formatSeconds = seconds <= 9 ? `0${seconds}` : seconds
        return (
            <StyledTimer>
                {formatMinutes}:{formatSeconds}
            </StyledTimer>
        )
    }

    const onAnimationEnd = () => {
        if (!open){
            dispatchTurnOff(turnOffAlert());
            setRender(false);
        }
    }

    return (
        <StyledSnackbar
            onAnimationEnd={onAnimationEnd}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            open={render}
            animation={open ? 1 : 0}
        >
            <MuiAlert variant='filled' style={{background: 'yellowgreen'}}>
                <StyledAlertContent>
                    <div className='mr-2'>
                        <span className='mr-3' style={{fontWeight: 900, fontSize: '20px'}}>Kod: {code}</span>
                        Możesz dodawać pliki do {placeName}. Pozostały czas:
                    </div>

                    <TimerIcon className='mr-1'/>

                    <Countdown
                        date={Date.now() + time}
                        intervalDelay={0}
                        precision={3}
                        renderer={format}
                    />
                    <IconButton className='ml-3' size="small" aria-label="close" color="inherit"
                                onClick={handleCloseAlert}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </StyledAlertContent>
            </MuiAlert>
        </StyledSnackbar>
    );
};

export default CountdownAlert;

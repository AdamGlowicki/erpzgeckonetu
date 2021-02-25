import React, {Fragment, useContext, useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import {CarContext} from "../carDetail/CarDetail";

const slideDown = keyframes`
  from {transform: translateY(-200px); opacity: 0}
`
const slideUp = keyframes`
  from {transform: translateY(0); opacity: 1}
  to {transform: translateY(-200px); opacity: 0}
`

const StyledWrapper = styled.div.attrs({
    className: 'p-3'
})`
  position: fixed;
  right: 20px;
  top: 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color:#fff;
  background-color: ${props => props.color};
  animation: ${props => props.animation ? slideDown : slideUp} .5s;
`

const ActionAlert = () => {
    const {alert, setAlert} = useContext(CarContext);
    const [open ,setOpen] = useState(false);
    const [color, setColor] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        if (alert.open) {
            setOpen(true)
            setColor(alert.type === 'success' ? 'yellowgreen' : 'red')
            setText(alert.message)
        }
    },[alert])

    useEffect(() => {
        const handler = setTimeout(() => setAlert({open: false}), 5000)

        return () => {
            clearTimeout(handler)
        }
    }, [open])

    const onAnimationEnd = () => {
        !alert.open && setOpen(false)
    }

    return (
        <Fragment>
        {open ? (
                <StyledWrapper
                    onAnimationEnd={onAnimationEnd}
                    animation={alert.open}
                    color={color}
                >
                    {text}
                </StyledWrapper>
            ) : null
        }
        </Fragment>

    );
};

export default ActionAlert;

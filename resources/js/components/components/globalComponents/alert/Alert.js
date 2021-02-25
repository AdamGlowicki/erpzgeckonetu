import React, {Fragment, useContext, useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

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
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color:#fff;
  background-color: ${props => props.color};
  animation: ${props => props.animation ? slideDown : slideUp} .5s;
`

const Alert = ({context}) => {
    const {alert, setAlert} = useContext(context)
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState('');
    const [text, setText] = useState('');
    const [ms, setMs] = useState(0);

    useEffect(() => {
        if (alert.open) {
            setOpen(true)
            setColor(alert.type === 'success' ? 'yellowgreen' : 'red')
            setText(alert.message)
            setMs(alert.ms)
        }
    }, [alert])

    useEffect(() => {
        const handler = setTimeout(() => setAlert({open: false}), ms)

        return () => {
            clearTimeout(handler)
        }
    }, [open])

    const onAnimationEnd = () => {
        !alert.open && setOpen(false)
    }

    const close = () => {
        setAlert({open: false})
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
                    <IconButton
                        className='ml-2'
                        onClick={close}

                        size='small'
                    >
                        <CloseIcon style={{color: 'red'}} fontSize='small'/>
                    </IconButton>
                </StyledWrapper>
            ) : null}
        </Fragment>
    );
};

export default Alert;

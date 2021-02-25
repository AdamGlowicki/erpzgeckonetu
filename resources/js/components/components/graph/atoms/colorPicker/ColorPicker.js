import React, {Fragment, useEffect, useState} from 'react';
import {CompactPicker} from 'react-color';
import styled, {keyframes} from 'styled-components';

const slide = keyframes`
  from {opacity: 1; transform: translateX(300px);}
  to {opacity: 1; transform: translateX(0);}
`
const slideOut = keyframes`
  from {transform: translateX(0);}
  to {opacity: 0; transform: translateX(300px);}
`

const StyledWrapper = styled.div`
  position: fixed;
  top: 50%;
  right: 10%;
  border-radius: 4px;
  box-shadow: 10px 11px 19px -8px rgba(0,0,0,0.47);
  animation: ${props => props.animation ? slide : slideOut} .5s;
  transform-origin:${props => props.animation ? 'left' : 'right'};
  z-index: 9999;
`

const ColorPicker = ({open: openPros, handleStyle, name, color, }) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (openPros) setOpen(true)
    }, [openPros])


    const onAnimationEnd = () => {
        if (!openPros) setOpen(false)
    }

    const handleChangeColor = (color) => {
        const event = {
            target: {
                name,
                value: color.hex,
            }
        }
        handleStyle(event)
    }

    return (
        <Fragment>
            {open ? (
                <StyledWrapper
                    onAnimationEnd={onAnimationEnd}
                    animation={openPros}
                >
                    <CompactPicker
                        onChangeComplete={handleChangeColor}
                        color={color}
                    />
                </StyledWrapper>
            ) : null}
        </Fragment>
    );
}

export default ColorPicker;

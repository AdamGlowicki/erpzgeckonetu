import React, {useRef, useState} from 'react';
import styled from 'styled-components';
import ColorPicker from "../../atoms/colorPicker/ColorPicker";
import {useFocusRef} from "../../../../hooks/useFocusRef";

const StyledButtonColorPicker = styled.button`
  position: relative;
  width: 100%;
  height: 18px;
  border-radius: 4px;
  background-color: ${props => props.color};
`

const ColorPickerButton = ({handleStyle, name, color}) => {

    const [open, setOpen] = useState(false)

    return (
        <StyledButtonColorPicker
            color={color}
            onClick={() => setOpen(!open)}
        >
            <ColorPicker
                open={open}
                handleStyle={handleStyle}
                name={name}
                color={color}
            />
        </StyledButtonColorPicker>
    );
};

export default ColorPickerButton;

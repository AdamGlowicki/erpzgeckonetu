import React, {Fragment, memo, useState} from 'react';
import styled from 'styled-components';
import CustomHandle from "../../atoms/customHandle/CustomHandle";
import {Positions} from "../../../../enums/positions";

const StyledSquare = styled.div`
  position: relative;
  box-sizing: border-box;
  box-shadow: 9px 9px 20px -9px rgba(0,0,0,0.75);
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  transform: ${props => `rotate(${props.rotate}deg)`};
   background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.radius}%;
  border: ${props => `${props.borderSize}px ${props.borderType} ${props.borderColor}`};
  font-size: ${props => props.fontSize}px;
  font-weight: ${props => props.fontWeight};
  color: ${props => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
`;


const StyledLabel = styled.div`
  position: absolute;
  transform: ${props => `rotate(${props.rotate}deg)`};
  overflow: hidden;
  max-width: 100%;
`

export default memo(({data: {style, label,}, id,}) => {
        let {width, height, backgroundColor, radius, borderSize, borderType, borderColor, fontSize, fontWeight, color, rotate} = style;

        return (
            <Fragment>
                <StyledSquare
                    color={color}
                    width={width}
                    height={height}
                    backgroundColor={backgroundColor}
                    radius={radius}
                    borderSize={borderSize}
                    borderType={borderType}
                    borderColor={borderColor}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    rotate={rotate}
                    tabIndex={1}
                >
                    <CustomHandle
                        handleId='a'
                        id={id}
                        type='source'
                        position='bottom'
                    />

                    <CustomHandle
                        handleId='b'
                        id={id}
                        type='target'
                        position='top'
                    />
                    <StyledLabel rotate={rotate * -1}>
                        {label}
                    </StyledLabel>
                </StyledSquare>
            </Fragment>
        )
    }
)

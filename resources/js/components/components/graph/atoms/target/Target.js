import React from 'react';
import styled from 'styled-components';
import {Positions} from "../../../../enums/positions";

const StyledTarget = styled.div`
  position: absolute;
  top: ${props => props.coordinates.y};
  left: ${props => props.coordinates.x};
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: #84db9e;
  cursor: pointer;
`

const Target = ({position, addSource, addTarget}) => {

    const setCoordinates = () => {
        switch (position) {
            case Positions.TOP:
                return {x: '50%', y: 0, dx: '-50%', dy: '-50%'};
            case Positions.BOTTOM:
                return {x: '50%', y: '100%', dx: '-50%', dy: '50%'};
            case Positions.LEFT:
                return {x: 0, y: '50%', dx: '-50%', dy: '-50%'};
            case Positions.RIGHT:
                return {x: '100%', y: '50%', dx: '50%', dy: '-50%'};
            default:
                return {x: 0, y: 0, dx: 0, dy: 0}
        }
    }

    return (
        <StyledTarget
            coordinates={setCoordinates()}
            onClick={addTarget}
            onContextMenu={addSource}
        />
    );
};

export default Target;

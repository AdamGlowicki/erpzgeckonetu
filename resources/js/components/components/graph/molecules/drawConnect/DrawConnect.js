import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';
import {useStartDraw} from "../../../../hooks/useStartDrow";

const StyledDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: pink;
`

const DrawConnect = () => {
    // const { start, move, allowConnect} = props
    const canvasRef = useRef(null)
    const refStartLine = useRef(null)

    const {start, move, connect} = useStartDraw(refStartLine );


    useEffect(() => {
        const canvas = canvasRef.current
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const ctx = canvas.getContext('2d')

        const render = () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if (move.x > 4) {
                ctx.beginPath();
                ctx.lineWidth = 8
                ctx.lineCap = 'round'
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(move.x, move.y);
                ctx.stroke();
            }

        }
        render()
    }, [start, move])

    // useEffect(() => {
    //     if (!allowConnect) {
    //         ctx.clearRect(0,0,canvas.width,canvas.height);
    //     }
    // }, [allowConnect])


    return (
        <div>
            <StyledDot ref={refStartLine}/>
            <canvas ref={canvasRef}/>
            <rect
                width={}
            />
        </div>
        )
};

export default DrawConnect;

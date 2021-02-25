import {useEffect, useState} from "react";

export const useStartDraw = (ref, position, allowConnect) => {
    const [start, setStart] = useState({})
    const [move, setMove] = useState({})
    const [connect, setConnect] = useState(false);

    useEffect(() => {

        const handleMouseDown = (e) => {
            const {width, height} = ref.current.getBoundingClientRect();
            // setStart({x: position.x + (width / 2), y: position.y + (height / 2)})
            setStart({x: (width / 2), y: (height / 2)})

            const handleMouseMove = (e) => {
                setMove({x: e.offsetX, y: e.offsetY})
            }

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup',
                () => {
                    if (allowConnect) {
                        setConnect(true)
                    }
                    document.removeEventListener('mousemove', handleMouseMove)
                },
                {once: true}
            );
        }

        ref.current.addEventListener('mousedown', handleMouseDown)
        return () => {
            ref.current.removeEventListener('mousedown', handleMouseDown)
        }
    })

    return {start, move, connect}
}

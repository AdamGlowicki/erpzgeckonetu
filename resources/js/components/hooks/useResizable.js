import {useEffect, useState} from "react";

export const useResizable = (ref, initWidth = 100, initHeight = 100) => {

    const [{width, height}, setSize] = useState({width: 0, height: 0})

    useEffect(() => {
        setSize({width: initWidth, height: initHeight})
    }, [])

    useEffect(() => {
        const handleMouseDown = (e) => {
            const x = e.pageX;
            const y = e.pageY;
            const handleMouseMove = (e) => {
                const newWidth = width - (x - e.pageX);
                const newHeight = height - (y - e.pageY);
                setSize({
                    width: newWidth,
                    height: newHeight,
                })
            }

            document.addEventListener("mousemove", handleMouseMove);

            document.addEventListener("mouseup",
                () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                },
                {once: true}
            );
        }

        ref.current.addEventListener('mousedown', handleMouseDown)
        return () => {
            ref.current.removeEventListener("mousedown", handleMouseDown);
        };
    }, [width, height]);

    useEffect(() => {
        ref.current.style.width = `${width}px`
        ref.current.style.height = `${height}px`
    }, [width, height])

}

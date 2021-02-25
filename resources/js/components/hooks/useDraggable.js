import {useEffect, useState} from "react";

export const useDraggable = (ref, rotate) => {
    const [{dx, dy}, setOffset] = useState({dx: 0, dy: 0})

    useEffect(() => {
        const handleMouseDown = e => {
            const startX = e.pageX - dx;
            const startY = e.pageY - dy;
            const handleMouseMove = event => {
                const newDx = event.pageX - startX;
                const newDy = event.pageY - startY;
                setOffset({ dx: newDx, dy: newDy });
            };

            document.addEventListener("mousemove", handleMouseMove);

            document.addEventListener("mouseup",
                () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                },
                { once: true }
            );
        };

        ref.current.addEventListener("mousedown", handleMouseDown);

        return () => {
            ref.current.removeEventListener("mousedown", handleMouseDown);
        };
    }, [dx, dy]);

    useEffect(() => {
        ref.current.style.transform = `translate(${dx}px, ${dy}px)`;
    }, [dx, dy]);

}

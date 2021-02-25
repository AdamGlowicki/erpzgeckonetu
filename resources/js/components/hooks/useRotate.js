import {useEffect, useState} from "react";

export const useRotate = (ref, refHandle, startAngle) => {

    const [rotate, setRotate] = useState(startAngle)

    const getAngle = ({x: x1, y: y1}, {x: x2, y: y2}) => {
        const dot = x1 * x2 + y1 * y2
        const det = x1 * y2 - y1 * x2
        const angle = Math.atan2(det, dot) / Math.PI * 180
        return (angle + 360) % 360
    }

    const rotateByDeg = (angle, deg) => {
        if (Math.floor(angle) % deg === 0) {
            return angle
        }
    }

    useEffect(() => {
        const handleMouseDown = (e) => {
            const {width, height, left, top} = ref.current.getBoundingClientRect();
            const {clientX, clientY} = e;
            console.log(width)
            const center = {
                x: left + width / 2,
                y: top + height / 2,
            }

            const startVector = {
                x: clientX - center.x,
                y: clientY - center.y,
            }

            const handleMouseMove = (e) => {
                e.stopImmediatePropagation();

                const {clientX, clientY} = e
                const rotateVector = {
                    x: clientX - center.x,
                    y: clientY - center.y
                }

                const angle = getAngle(startVector, rotateVector)
                const rotateBy5 = rotateByDeg(angle, 5);
                setRotate(rotateBy5 + startAngle)
            }
            document.addEventListener('mousemove', handleMouseMove);

            document.addEventListener('mouseup',
                () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                },
                {once: true}
            )
        }

        refHandle.current.addEventListener('mousedown', handleMouseDown)

        return () => {
            refHandle.current.removeEventListener("mousedown", handleMouseDown);
        }
    }, [rotate])

    useEffect(() => {
        ref.current.style.transform = `rotate(${rotate}deg)`;

    }, [rotate])

    return rotate
}

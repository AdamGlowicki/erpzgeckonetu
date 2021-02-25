import React, {useRef} from 'react';
import {useReactToPrint} from 'react-to-print';

const Printer = ({children}) => {

    const componentRef = useRef();
    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    // });
    const handlePrint = () => {
        window.print()
    }
    return (
        <div>
            <div ref={componentRef}>
                {/*{children}*/}
            </div>
            <button onClick={handlePrint}>print this out</button>
        </div>
    );
}

export default Printer;

import React, {Fragment} from 'react';
import {Handle} from 'react-flow-renderer';

const CustomHandle = ({handleId, type, position, id,}) => {

    const setStyleByType = () => {
        if (type === 'source') {
            return {background: '#fff', border: '2px solid black', width: '10px', height: '10px'}
        } else if (type === 'target') {
            return {background: 'yellowgreen', width: '10px', height: '10px'}
        } else {
            return {width: '16px', height: '16px', background: '#84db9e'}
        }
    }

    return (
        <Fragment>
                <Handle
                    type={type}
                    position={position}
                    id={handleId}
                    style={{...setStyleByType()}}
                    handleId={id}
                />
        </Fragment>
    );
};

export default CustomHandle;

import React from 'react';
import Form from 'react-bootstrap/Form';

const Input = ({...props}) => {
    return (
        <Form.Control className='ml-2' {...props}/>
    );

};
export default Input;

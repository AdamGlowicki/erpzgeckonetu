import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {connect} from 'react-redux';
import {CLOSE_EDIT_CELL, SET_MAIN_CELLS_NAME} from '../../../reducers/investments/duck/reduxType';
import {setError, setLoading} from '../../../common/globalMethods';
import {patchData, postData} from '../../../common/apiMethods/apiMethods';
import {useCookies} from "react-cookie";

const closeEdit = () => ({
    type: CLOSE_EDIT_CELL,
});

const updateName = (value) => ({
    type: SET_MAIN_CELLS_NAME,
    payload: value
})

const EditCellName = ({isOpenEdit, closeEdit, updateCellName: updateName, editData: {message, stageId}, setLoading, setError}) => {

    const [name, setName] = useState(message);

    const [cookies, setCookie] = useCookies(['name'])

    const handleChange = (e) => {
        const {value} = e.target;
        setName(value);
    };

    const asyncUpdateMainName = async () => {
        setLoading(true);
        try {
            const result = await patchData(`/invest/${stageId}`, {stage_name: name}, cookies)
            updateName(name)
        } catch (e) {
            setLoading(false)
            setError({isError: true, errorMessage: `NIe udało się zmienić na ${name}`})
            setName(message)
        }
        setLoading(false)
    };

    useEffect(() => {
        let handler;
        if (name !== message) {
            handler = setTimeout(asyncUpdateMainName, 500);
        }
        return () => {
            clearTimeout(handler)
        }
    }, [name]);

    return (
        <Modal size={'sm'} show={isOpenEdit} onHide={closeEdit}>
            <Modal.Header closeButton>
                <Modal.Title>Edytuj nazwę:</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Control validate onChange={handleChange} value={name}/>
            </Modal.Body>
        </Modal>
    );
};

const mapStateToProps = ({investments: {isOpenEdit, editData}}) => ({isOpenEdit, editData});
const mapDispatchToProps = dispatch => ({
    closeEdit: () => dispatch(closeEdit()),
    updateCellName: (value) => dispatch(updateName(value)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCellName);

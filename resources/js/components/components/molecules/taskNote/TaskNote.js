import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {UPDATE_NOTE} from '../../../reducers/investments/duck/reduxType';
import {connect} from 'react-redux';
import {setError, setLoading} from '../../../common/globalMethods';
import {patchData, postData} from '../../../common/apiMethods/apiMethods';
import {useCookies} from "react-cookie";
import TextArea from "../../atoms/textArea/TextArea";

const StyledTextArea = styled.div.attrs({
    className: 'mt-3'
})`
`;

const updateNote = (data) => ({
    type: UPDATE_NOTE,
    payload: data
});

const TaskNote = ({note, id, stageId, updateNote, setLoading, setError}) => {
    const [stateNote, setNote] = useState('');

    const [cookies, setCookie] = useCookies(['name'])

    useEffect(() => {
        setNote(note)
    }, [note]);

    const asyncUpdateNote = async () => {
        setLoading(true);
        try {
            await patchData(`/task/${id}`, {notes: stateNote}, cookies);
            updateNote({stateNote, stageId, id});
        } catch (e) {
            setLoading(false)
            setError({isError: true, errorMessage: 'Nie udało się wprowazić zmiany w notatce.'})
            setNote(note);
        }
        setLoading(false)
    };

    useEffect(() => {
        let handler;
        if (stateNote !== note) {
            handler = setTimeout(asyncUpdateNote, 500);
        }
        return () => {
            clearTimeout(handler);
        };
    }, [stateNote]);

    const handleChange = (e) => {
        const {value} = e.target;
        setNote(value)
    };

    return (
        <StyledTextArea>
            <TextArea
                rows={7}
                label='Notatka'
                aria-label="maximum height"
                placeholder="Dodaj notatkę"
                value={stateNote}
                onChange={handleChange}
            />
        </StyledTextArea>
    );
};

TaskNote.propTypes = {
    note: PropTypes.string,
    updateNote: PropTypes.func,
    setLoading: PropTypes.func,
    setError: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
    updateNote: (note) => dispatch(updateNote(note)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
});
export default connect(null, mapDispatchToProps)(TaskNote);

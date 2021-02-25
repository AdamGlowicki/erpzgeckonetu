import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import TableCell from "@material-ui/core/TableCell";
import {makeStyles} from "@material-ui/core/styles";
import {patchData} from "../../../../common/apiMethods/apiMethods";
import {setError, setLoading} from "../../../../common/globalMethods";
import {useCookies} from "react-cookie";
import {connect} from 'react-redux';
import {SET_FIRST_COLUMN} from "../../../../reducers/investments/duck/reduxType";

const useStyles = makeStyles(theme => ({
    root: {
        border: 0,
        color: 'black',
        height: '300px',
        padding: '0 30px',

    },
    animated: {
        fontSize: '10px',
        width: '84%'
    },
    smallSize: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        background: ({background}) => background,
    }
}));

const styledInput = makeStyles({
    root: {
        fontSize: 10,
    }
});

const setFirstColumn = data => ({
    type: SET_FIRST_COLUMN,
    payload: data,
});

const NoteInTable = ({title, rowColor, id, stageId, taskId, setLoading, setError, setFirstColumn}) => {
    const [stateTitle, setStateTitle] = useState('');
    const [cookies, setCookie] = useCookies(['name'])

    const classes = useStyles({background: rowColor});
    const styledInp = styledInput();

    useEffect(() => {
        !title && (title = '')
        setStateTitle(title);
    }, [title])

    const handleSetTitle = (e) => {
        const {value} = e.target;
        setStateTitle(value);
    };

    const asyncUpdateTextArea = async () => {
        setLoading(true);
        try {
            await patchData(`/body/${id}`, {title: stateTitle}, cookies);
            setFirstColumn({value: stateTitle, id, stageId, taskId})
        } catch (e) {
            setError({isError: true, errorMessage: `Nie udało się zrobić zmiany do ${stateTitle}`});
            setStateTitle(title)
        }
        setLoading(false)
    };

    useEffect(() => {
        let handler;
        if (stateTitle !== title) {
            handler = setTimeout(asyncUpdateTextArea, 500)
        }
        return () => {
            clearTimeout(handler)
        }
    }, [stateTitle]);

    return (
        <TableCell className={classes.smallSize}>
            <TextareaAutosize
                className={styledInp.root}
                rowsMax={5}
                aria-label="maximum height"
                placeholder="Dodaj notatkę"
                value={stateTitle}
                onChange={handleSetTitle}
            />
        </TableCell>
    );
};

NoteInTable.propTypes = {

};

const mapDispatchToProps = dispatch => ({
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
    setFirstColumn: (data) => dispatch(setFirstColumn(data)),
})

export default connect(null, mapDispatchToProps)(NoteInTable);

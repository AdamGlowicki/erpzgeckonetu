import React from 'react';
import PropTypes from 'prop-types'
import ButtonTemplate from '../../../template/ButtonTemplate';
import {connect} from 'react-redux';
import {ADD_CELL} from '../../../reducers/investments/duck/reduxType';
import {setError, setLoading} from '../../../common/globalMethods';
import {patchData, postData} from '../../../common/apiMethods/apiMethods';
import {useCookies} from "react-cookie";
import CellsColor from "../../../enums/CellsColor";
import PlusOneIcon from "@material-ui/icons/PlusOne";
import IconButton from "@material-ui/core/IconButton";

const addCell = (data) => ({
    type: ADD_CELL,
    payload: data
});

const AddCell = ({stageId, taskId, position, addCell, setError, setLoading, disabled, main}) => {
    const [cookies, setCookie] = useCookies(['name'])

    const asyncHandleAddTask = async () => {
        setLoading(true);
        try {
            await patchData(`/task/${position}/${stageId}`, {}, cookies);
            const result = await postData(`/task/${stageId}`, {
                name: 'Etap', invest_id: stageId, mini_note: '', position: position + 1, status: CellsColor.Empty
            }, cookies);
            console.log(result)
            addCell({stageId, taskId, id: result.data[result.data.length - 1].id, updatedTasks: result.data});
        } catch (e) {
            setLoading(false)
            setError({isError: true, errorMessage: `Nie udało się dodać nowego etapu.`})
        }
        setLoading(false);
    };

    return (
        <React.Fragment>
            {main ? (
                <IconButton disabled={!disabled} onClick={asyncHandleAddTask}>
                    <PlusOneIcon style={{fontSize: '12px'}}/>
                </IconButton>
            ) : (
                <ButtonTemplate disabled={!disabled} onClick={asyncHandleAddTask}>+</ButtonTemplate>
            )}
        </React.Fragment>

    );
};

const mapDispatchToProps = (dispatch) => ({
    addCell: (data) => dispatch(addCell(data)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
});

const mapStateToProps = ({investments: {mainStage}}) => ({
    firstPosition: (stageId) => Math.min.apply(Math, mainStage.find(stage => stage.id === stageId).tasks.map(task => task.position))
})

AddCell.propTypes = {
    stageId: PropTypes.number,
    taskId: PropTypes.number,
    addCell: PropTypes.func,
    setError: PropTypes.func,
    setLoading: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCell);

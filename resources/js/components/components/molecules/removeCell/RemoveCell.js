import React, {useState} from 'react';
import ButtonTemplate from '../../../template/ButtonTemplate';
import {REMOVE_TASK} from '../../../reducers/investments/duck/reduxType';
import AcceptWindow from '../acceptWindow/AcceptWindow';
import {connect} from 'react-redux';
import {setError, setLoading} from '../../../common/globalMethods';
import {deleteData} from '../../../common/apiMethods/apiMethods';
import {useCookies} from "react-cookie";

const removeTask = (data) => ({
    type: REMOVE_TASK,
    payload: data
});

const RemoveCell = ({stageId, taskId, cellName, disabled, removeCell, setError, setLoading}) => {
    const [openApprovedWindow, setOpenApprovedWindow] = useState(false);

    const [cookies, setCookie] = useCookies(['name'])

    const asyncHandlerRemove = async () => {
        setLoading(true);
        try {
            const result = await deleteData(`/task/${taskId}`, cookies);
            console.log(result)
            removeCell({stageId, taskId});
        } catch (e) {
            setLoading(false);
            setError({isError: true, errorMessage: `Nie udało się usunąć etapu ${cellName}`})
        }
        setOpenApprovedWindow(false);
        setLoading(false);
    };

    const handleClick = () => {
        setOpenApprovedWindow(true);
    };
    const handleApproved = () => {
        asyncHandlerRemove()
    };

    return (
        <React.Fragment>
            <ButtonTemplate disabled={!disabled} remove onClick={handleClick}>-</ButtonTemplate>
            <AcceptWindow
                open={openApprovedWindow}
                handleClose={setOpenApprovedWindow}
                handleApproved={handleApproved}
            >
                Czy na pewno chcesz usunąć komórkę {cellName}?
            </AcceptWindow>
        </React.Fragment>
    );
};

const mapDispatchToProps = dispatch => ({
    removeCell: (data) => dispatch(removeTask(data)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
});


export default connect(null, mapDispatchToProps)(RemoveCell);

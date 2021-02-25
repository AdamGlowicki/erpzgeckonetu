import React, {useState} from 'react';
import PropTypes from 'prop-types'
import ButtonTemplate from '../../../template/ButtonTemplate';
import {FIND_OBJECTS_IDS, REMOVE_MIDDLE_TASK} from '../../../reducers/investments/duck/reduxType';
import AcceptWindow from '../acceptWindow/AcceptWindow';
import {connect, useSelector} from 'react-redux';
import {setError, setLoading} from '../../../common/globalMethods';
import {deleteDataByIds} from '../../../common/apiMethods/apiMethods';
import {useCookies} from "react-cookie";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

const removeMiddleStage = (data) => ({
    type: REMOVE_MIDDLE_TASK,
    payload: data
});

const findObjectsIds = payload => ({
    type: FIND_OBJECTS_IDS,
    payload
});
const RemoveMiddleStage = ({stageId, children, stageName, main, adder, removeMiddleStage, findObjectsIds, setLoading, setError, treeIds}) => {

    const [openApprovedWindow, setOpenApprovedWindow] = useState(false);

    const [cookies, setCookie] = useCookies(['name']);

    const loggedUser =  useSelector(state => state.user.user.data)

    const handleClick = () => {
        setOpenApprovedWindow(true);
        findObjectsIds({stageId})
    };

    const asyncHandleRemove = async () => {
        setLoading(true);
        try {
            const result = await deleteDataByIds(`/invest`, cookies, treeIds);
            removeMiddleStage(treeIds);
        } catch (e) {
            setLoading(false);
            setError({isError: true, errorMessage: `Nie udało się usunąć wiersza ${stageName}`})
        }
        setLoading(false);
        setOpenApprovedWindow(false)
    };

    const handleApproved = async () => {
        await asyncHandleRemove()
    };

    const ifLoggedIsNotAdder = () => (
        adder !== loggedUser
    )

    return (
        <React.Fragment>
            <Tooltip title={ifLoggedIsNotAdder() && `Poproś ${adder} o usunięcie 🗣️`} >
                <div>
                    <Button disabled={ifLoggedIsNotAdder()} onClick={handleClick} variant="contained" color="secondary">Usuń inwestycję</Button>
                </div>
            </Tooltip>
                <AcceptWindow
                    open={openApprovedWindow}
                    handleClose={setOpenApprovedWindow}
                    handleApproved={handleApproved}
                >
                    Czy na pewno chcesz usunąć {stageName} wraz ze wszytskimi podetapami?
                </AcceptWindow>
        </React.Fragment>
    );
};

const mapDispatchToProps = dispatch => ({
    removeMiddleStage: (data) => dispatch(removeMiddleStage(data)),
    findObjectsIds: data => dispatch(findObjectsIds(data)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data))
});

const mapStateToProps = ({investments: {treeIds}}) => ({
    treeIds,
});

RemoveMiddleStage.propTypes = {
    stageId: PropTypes.number,
    parentId: PropTypes.number,
    stageName: PropTypes.string,
    removeMiddleStage: PropTypes.func,
    mainStage: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(RemoveMiddleStage);

import React, {useEffect} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types'


const EveryFileCheckbox = ({checkedState, handleCheckbox}) => {
    useEffect(() => {
        checkedState ? checkedState = true : checkedState = false
    }, [checkedState])
    return (
        <Tooltip title="Dodane wszytkie pliki">
            <Checkbox
                checked={checkedState}
                onChange={handleCheckbox}
                color="primary"
                inputProps={{'aria-label': 'secondary checkbox'}}
            />
        </Tooltip>
    );
};

EveryFileCheckbox.propTypes = {
    handleCheckbox: PropTypes.func
};

export default EveryFileCheckbox;

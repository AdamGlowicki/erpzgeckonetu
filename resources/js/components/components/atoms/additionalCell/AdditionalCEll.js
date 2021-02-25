import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import CellTemplate from '../../../template/CellTemplate';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import styled, {css} from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import {connect} from 'react-redux';
import {UPDATE_ADDITIONAL_CELL} from '../../../reducers/investments/duck/reduxType';
import {setError, setLoading} from '../../../common/globalMethods';
import {patchData, postData} from '../../../common/apiMethods/apiMethods';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {Breakpoints} from "../../../enums/sizing/breakpionts";
import {useCookies} from "react-cookie";

const StyledAdditionalCell = styled.div`
  background-color: white;
  position:absolute;
  left: -120px;
  top: 0;
  ${({matches}) => (
    matches && css`
      left: 0;
    `
  )}
`;

const useStyles = makeStyles({
    root: {
        width: '86px',
        [`@media(max-width:${Breakpoints.MD})`] : {
            width: '160px'
        }
    },
});

const updateAddCell = (data) => ({
    type: UPDATE_ADDITIONAL_CELL,
    payload: data
})

const AdditionalCEll = ({value, stageId, updateAddCell, setLoading, setError}) => {
    const [stateValue, setValue] = useState(value);
    const matches = useMediaQuery(`(max-width:${Breakpoints.MD})`);
    const classes = useStyles({matches});

    const [cookies, setCookie] = useCookies(['name'])

    const asyncUpdateCell = async () => {
        setLoading(true)
        try {
            const result = await patchData(`/invest/${stageId}`, {client: stateValue}, cookies);
            updateAddCell({value, stageId});
        } catch (e) {
            setLoading(false)
            setError({isError: true, errorMessage: 'Nie udało sie aktualizować.'})
            setValue(value);
        }
        setLoading(false);
    };

    useEffect(() => {
        setValue(value);
    }, [value])

    useEffect(() => {
        let handler;
        if (stateValue !== value) {
            handler = setTimeout(asyncUpdateCell, 500)
        }
        return () => {
            clearTimeout(handler);
        }
    }, [stateValue])

    const handleChange = e => {
        const {value} = e.target;
        setValue(value);
    };

    return (
        <Tooltip title={stateValue}>
            <StyledAdditionalCell matches={matches}>
                <CellTemplate>
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="standard-basic"
                            label="Klient"
                            value={stateValue}
                            onChange={handleChange}
                        />
                    </form>
                </CellTemplate>
            </StyledAdditionalCell>
        </Tooltip>

    );
};

const mapDispatchToProps = dispatch => ({
    updateAddCell: (data) => dispatch(updateAddCell(data)),
    setError: data => dispatch(setError(data)),
    setLoading: data => dispatch(setLoading(data)),
});

AdditionalCEll.propTypes = {
    value: PropTypes.string,
    updateAddCell: PropTypes.func,
    stageId: PropTypes.number,
    setLoading: PropTypes.func,
    setError: PropTypes.func,
};

AdditionalCEll.defaultProps = {
    value: ''
};

export default connect(null, mapDispatchToProps)(AdditionalCEll);

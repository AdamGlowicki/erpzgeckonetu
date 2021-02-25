import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import InputText from "../../atoms/inputText/InputText";
import ShakeContent from "../../atoms/shakeContent/ShakeContent";
import AssignmentIcon from '@material-ui/icons/Assignment';
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {IS_ERROR, IS_LOADING, UPDATE_NAME} from "../../../reducers/investments/duck/reduxType";
import {patchData} from "../../../common/apiMethods/apiMethods";
import {useDispatch} from "react-redux";
import {useCookies} from "react-cookie";
import {setSuccess} from "../../../common/globalMethods";

const StyledWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 150px;
  width: 300px;
`

const StyledHead = styled.div.attrs({
    className: 'ml-2'
})`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const StyledContent = styled.div`

`
const StyledButtonContent = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ColorButton = withStyles((theme) => ({
    root: {
        marginLeft: ({second}) => second && theme.spacing(1),
        color: 'white',
        backgroundColor: 'rgb(162,198,0)',
        '&:hover': {
            backgroundColor: 'rgb(162,198,100)',
        },
    },
}))((props) => <Button {...props}/>);



const EditContent = ({name, stageId, id, setOpen}) => {

    const [stateName, setStateName] = useState('');
    const [shakeError, setShakeError] = useState(false)
    const [error, setStateError] = useState(false)

    const setLoading = useDispatch()
    const setError = useDispatch()
    const setTitle = useDispatch()
    const dispatchSuccess = useDispatch();

    const [cookies, setCookie] = useCookies(['name'])

    useEffect(() => {
        setStateName(name);
    }, [])

    useEffect(() => {
        const handler = setTimeout(() => setShakeError(false), 500)
        return () => {
            clearTimeout(handler)
        }
    }, [shakeError])

    const handleName = e => {
        const {value} = e.target;
        setStateName(value)
    }

    const asyncUpdateName = async () => {
        setLoading({type: IS_LOADING, payload: true});
        try {
            const result = await patchData(`/task/${id}`, {name: stateName}, cookies);
            setTitle({type: UPDATE_NAME, payload: {stageId, id, value: stateName}})
            dispatchSuccess(setSuccess({isSuccess: true, successMessage: `Zmieniono na ${stateName}.`}))
        } catch (e) {
            setLoading({type: IS_LOADING, payload: false});
            setError({
                type: IS_ERROR,
                payload: {
                    isError: true,
                    errorMessage: 'Zmiana nazwy nie powiodła się.'
                }
            });
            setStateName(name);
        }
        setLoading({type: IS_LOADING, payload: false});
    };

    const handleSave = async () => {
        if (stateName.length) {
            await asyncUpdateName()
            setOpen(false)
        } else {
            setShakeError(true)
            setStateError(true);
        }
    }

    return (
        <StyledWrapper>
            <StyledHead>
                <AssignmentIcon fontSize='small'/>
                <div className='ml-1'>Zmień nazwę etapu.</div>
            </StyledHead>

            <StyledContent>
                <ShakeContent shake={shakeError}>
                    <InputText
                        name='name'
                        label='Nazwa'
                        value={stateName}
                        onChange={handleName}
                        required
                        error={error}
                    />
                </ShakeContent>
            </StyledContent>

            <StyledButtonContent>
                <ShakeContent shake={shakeError}>
                    <ColorButton onClick={handleSave}>Zapisz</ColorButton>
                </ShakeContent>
            </StyledButtonContent>

        </StyledWrapper>
    );
};

export default EditContent;

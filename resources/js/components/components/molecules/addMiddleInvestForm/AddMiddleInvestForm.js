import React, {useReducer, useState} from 'react';
import SelectStage from "../../atoms/selectStage/SelectStage";
import styled from 'styled-components'
import AssignmentIcon from '@material-ui/icons/Assignment';
import MyCircularProgress from "../myCircularProgress/MyCircularProgress";
import CustomInvest from "./CustomInvest";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {useDispatch} from "react-redux";
import {useCookies} from "react-cookie";
import {postData} from "../../../common/apiMethods/apiMethods";
import {ADD_MIDDLE_STAGE, IS_ERROR, IS_LOADING} from "../../../reducers/investments/duck/reduxType";

const StyledWrapper = styled.div`
  width: 50vw;
  height: 60vh;
  display: grid;
  grid-template-columns:1fr;
  grid-template-rows: auto 1fr auto;
  grid-gap: 20px;
`

const StyledButtonSection = styled.div.attrs({
    className: 'mb-2 mr-2'
})`
  grid-row: 3 / -1;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`

const StyledHead = styled.div.attrs({
    className: 'pt-1 pb-3'
})`
  grid-row: 1 / 2;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  font-weight: lighter;
  font-size: 16px;
`

const StyledContent = styled.section`
  grid-column: 1 / -1;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

const StyledTitle = styled.div.attrs({
    className: 'mb-2'
})`
  font-size: 20px;
  font-weight: bold;
`

const ColorButton = withStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(1),
        color: 'white',
        backgroundColor: 'rgb(162,198,0)',
        '&:hover': {
            backgroundColor: 'rgb(162,198,100)',
        },
    },
}))(Button);

const AddMiddleInvestForm = ({stage, close}) => {

    const {level, id, country, add_date, deadline} = stage;

    const [disableSaveButton, setDisableSaveButton] = useState(false);

    const addMiddleInvest = useDispatch();
    const setLoading = useDispatch();
    const setError = useDispatch();

    const [cookies, setCookie] = useCookies(['name'])

    const [inputs, setInputs] = useReducer((prevState, state) => ({...prevState, ...state}), {
        stage_name: '',
        task1: '',
    })

    const handleInputs = (e) => {
        const {value, name} = e.target;
        setInputs({
            [name]: value
        })
    }

    const basicInitTaskData = {
        notes: 'Pusta notatka',
        mini_note: 'mini notatka',
        position: 1,
        status: 'Niezdefiniowany',
    };

    const generateData = (id) => {
        const newInputs = {...inputs};
        delete newInputs.stage_name;
        const arr = Object.values(newInputs)
        return arr.map(item => {
            return {invest_id: id, name: item, ...basicInitTaskData}
        })
    }

    const asyncAddCustomMiddleInvest = async () => {
        setLoading({type: IS_LOADING, payload: true});
        try {
            const result = await postData(`/invest`, {
                parent_id: id,
                level: level + 1,
                client: '',
                stage_name: inputs.stage_name,
                main: 0,
                country,
                add_date,
                deadline,
            }, cookies);
            const tasks = await postData(`/tasks/${result.data.id}`, generateData(result.data.id), cookies)
            addMiddleInvest({type: ADD_MIDDLE_STAGE, payload:{
                id: result.data.id,
                parent_id: id,
                level: level + 1,
                stageName: inputs.stage_name,
                tasks: [...tasks.data],
                client: '',
                stage_name: inputs.stage_name,
                main: 0,
            }});
        } catch (e) {
            setLoading({type: IS_LOADING, payload: false});
            setError({type: IS_ERROR, payload: {isError: true, errorMessage: 'Nie udało się dodać pośredniego etapu.'}});
        }
        setLoading({type: IS_LOADING, payload: false});

    };
    const handleSave = async() => {
        await asyncAddCustomMiddleInvest()
        close()
    }

    const handleDisableButton = (bool) => {
        setDisableSaveButton(bool)
    }
    return (
        <React.Fragment>
            <StyledWrapper>
                <StyledHead>
                    <div className='mr-3'><AssignmentIcon/></div>
                    Dodawanie podinwestycji
                </StyledHead>

                <StyledContent>
                    <div>
                        <StyledTitle>
                            Domyślne inwestycje
                        </StyledTitle>
                        <SelectStage stage={stage} close={close} disableButton={handleDisableButton}/>
                    </div>

                    <div>
                        <StyledTitle>
                            Dodaj spersonalizowaną inwestycję
                        </StyledTitle>
                        <CustomInvest inputs={inputs} handleInputs={handleInputs}/>
                    </div>

                </StyledContent>

                <StyledButtonSection>
                    <ColorButton disabled={disableSaveButton} onClick={handleSave} variant="contained" color="primary">Dodaj</ColorButton>
                </StyledButtonSection>
            </StyledWrapper>
            <MyCircularProgress/>
        </React.Fragment>
    );
};

export default AddMiddleInvestForm;

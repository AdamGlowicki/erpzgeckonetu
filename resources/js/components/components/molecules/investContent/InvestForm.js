import React, {useEffect, useReducer, useState} from 'react';
import InvestInputs from "./InvestInputs";
import styled, {keyframes, css} from 'styled-components'
import DeveloperBoardIcon from "@material-ui/icons/DeveloperBoard";
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TechCondition from "./TechCondition";
import TextArea from "../../atoms/textArea/TextArea";
import {patchData, postData, postFile} from "../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {useDispatch, useSelector} from "react-redux";
import {ADD_INVESTMENT, IS_LOADING, UPDATE_MAIN_INVEST} from "../../../reducers/investments/duck/reduxType";
import {getToday, limitStringWithoutDots} from "../../../common/globalMethods";
import RemoveMiddleStage from "../removeMiddleStage/RemoveMiddleStage";
import GenerateInvestFiles from "../generateInvestFiles/GenerateInvestFiles";
import DialogToAddMiddleInvest from "../addMiddleInvestForm/DialogToAddMiddleInvest";
import Warehouse from "../warehouse/Warehouse";

const shake = keyframes`
  0% {transform: translateX(0);}
  10% {transform: translateX(-10px);}
  20% {transform: translateX(10px);}
  30% {transform: translateX(-10px);}
  40% {transform: translateX(10px);}
  50% {transform: translateX(-10px);}
  60% {transform: translateX(10px);}
  70% {transform: translateX(-10px);}
  80% {transform: translateX(10px);}
  90% {transform: translateX(-10px);}
  100% {transform: translateX(0);}
`

const StyledShakeButton = styled.div`
  ${({error}) => (
    error && css`
          animation: ${shake} .5s linear;
      `
)}
`

const StyledWrapper = styled.div`
  width: 80vw;
  height: 90vh;
  display: grid;
  grid-template-columns: 25% 75%;
  grid-template-rows: auto 1fr auto;
`

const StyledInputSection = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
`

const StyledContent = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / -2;
`

const StyledTitle = styled.div.attrs({
    className: 'mb-3'
})`
  font-size: 20px;
  font-weight: bold;
`

const StyledHead = styled.div.attrs({
    className: 'pt-1 pb-3'
})`
  grid-row: 1 / 2;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: lighter;
  font-size: 16px;
`

const StyledButtonSection = styled.div`
  grid-row: -2 / -1;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`

const StyledWrapperArea = styled.div.attrs({
    className: 'mt-4'
})`
  display: flex;
  flex-direction: column;
  justify-content: center;
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


const InvestForm = ({place, stage, setOpen}) => {

    const [cookies, setCookie] = useCookies(['name'])

    const updateMainInvest = useDispatch();
    const setLoading = useDispatch();
    const setError = useDispatch();

    const drawersState = useSelector(state => state.investments.drawers)

    const [openAddItemsToWarehouse, setOpenAddItemsToWarehouse] = useState(false);
    const [allowSave, setAllowSave] = useState(true);

    let {id, country, stage_name, adder, add_date, deadline, description, condition, condition_term, arrangements, tech, drawer_id, address} = stage;

    useEffect(() => {
        !country  && (country = '');
        !stage_name && (stage_name = '');
        !adder && (adder = '');
        !add_date && (add_date = getToday());
        !deadline && (deadline = getToday());
        !description && (description = '');
        !condition && (condition = '');
        !condition_term && (condition_term = getToday());
        !arrangements && (arrangements = '');
        !tech && (tech = '');
        !address && (address = '');
        setInputContent({
            country,
            stage_name,
            adder,
            add_date,
            deadline,
            description,
            condition,
            condition_term,
            arrangements,
            tech,
            drawer: drawersState.filter(item => item.id === drawer_id)[0] ? drawersState.filter(item => item.id === drawer_id)[0] : '',
            address,
        })
    }, [])

    useEffect(() => {
        const handler = setTimeout(() => setAllowSave(true), 1000)
        return () => {
            clearTimeout(handler)
        }
    }, [allowSave])

    const [inputsContent, setInputContent] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            country: "",
            stage_name: "",
            adder: '',
            add_date: '',
            deadline: '',
            description: '',
            condition: '',
            condition_term: '',
            arrangements: '',
            tech: '',
            drawer: {},
            address: '',
        }
    );

    const [inputValidate, setInputValidate] = useReducer((prevState, state) => ({...prevState, ...state}), {
        country: false,
        realized: false,
        stage_name: false,
        add_date: false,
        deadline: false,
    })

    const handleInput = (e) => {
        let {value, name} = e.target;
        if (name === 'inv_code') {
            value = limitStringWithoutDots(value, 3)
        }

        setInputContent({
            [name]: value,
        })
    }

    const returnNotError = () => {
        for (const [key, value] of Object.entries(inputValidate)) {
            setInputValidate({[key]: false})
        }
    }

    const validate = () => {
        let permission = true
        returnNotError()

        if (!inputsContent.country.length) {
            setInputValidate({country: true})
            permission = false
        }
        if (!inputsContent.stage_name.length) {
            setInputValidate({stage_name: true})
            permission = false
        }
        if (!inputsContent.adder.length) {
            setInputValidate({adder: true})
            permission = false
        }
        if (!inputsContent.add_date.length) {
            setInputValidate({add_date: true})
            permission = false
        }
        if (!inputsContent.deadline.length) {
            setInputValidate({deadline: true})
            permission = false
        }
        return permission
    }

    const handleSave = async () => {
        const permission = validate()
        setAllowSave(permission)
        if (permission) {
            await asyncUpdateInvestData()
            setOpen()
        } else {
        }
    }

    const asyncUpdateInvestData = async () => {
        setLoading({type: IS_LOADING, payload: true});
        try {
            const result = await patchData(`/invest/${id}`, {
                ...inputsContent,
                drawer_id: inputsContent.drawer.id ? inputsContent.drawer.id : null,
            }, cookies)
            updateMainInvest({type: UPDATE_MAIN_INVEST, payload: {id, data: result.data, drawer_id: inputsContent.drawer.id}})
        } catch (e) {
            setLoading({type: IS_LOADING, payload: false});
            setError({isError: true, errorMessage: `Nie udalo się zmienić aktualizować inwestycji.`});
        }
        setLoading({type: IS_LOADING, payload: false});
    }

    const closeWarehouseForm = () => {
        setOpenAddItemsToWarehouse(false)
    }

    const isNotAdd = (place) => (
        place === 'EDIT' || place === 'MAIN_CELL'
    )

    return (
        <React.Fragment>
            <StyledWrapper>

                <StyledHead>
                    <DeveloperBoardIcon/>
                    <div className='ml-2'>{stage_name}</div>
                </StyledHead>

                <StyledInputSection>
                    <StyledTitle>
                        Dane Inwestycji
                    </StyledTitle>
                    <InvestInputs drawers={drawersState} stage={stage} handleInput={handleInput} inputsContent={inputsContent}
                                  inputValidate={inputValidate}/>
                </StyledInputSection>

                <StyledContent>
                    <StyledTitle>
                        Notatki
                    </StyledTitle>
                    <StyledWrapperArea>
                        <TextArea value={inputsContent.description} onChange={handleInput} rows={4} label='Opis'
                                  name='description'/>
                    </StyledWrapperArea>
                    <TechCondition inputsContent={inputsContent} handleInput={handleInput}/>
                    <StyledWrapperArea>
                        <TextArea value={inputsContent.arrangements} onChange={handleInput} name='arrangements' rows={4}
                                  label='Uzgodnienia'/>
                    </StyledWrapperArea>
                    <div className='mt-4'>
                        {isNotAdd(place) && <GenerateInvestFiles stage={stage}/>}
                    </div>

                    <div className='mt-3'>
                        {isNotAdd(place) && (
                            <ColorButton onClick={() => setOpenAddItemsToWarehouse(!openAddItemsToWarehouse)}
                                         variant="contained" color="primary"
                            >
                                Stan Magazynowy
                            </ColorButton>
                        )}
                    </div>
                </StyledContent>

                <StyledButtonSection>
                    {isNotAdd(place) && <RemoveMiddleStage adder={adder} main stageId={id} stageName={country}/>}
                    <StyledShakeButton error={!allowSave}>
                        <ColorButton second='true' onClick={handleSave} variant="contained"
                                     color="primary">Zapisz</ColorButton>
                    </StyledShakeButton>
                </StyledButtonSection>

            </StyledWrapper>

            {openAddItemsToWarehouse && (<DialogToAddMiddleInvest
                open={openAddItemsToWarehouse}
                setOpen={setOpenAddItemsToWarehouse}
            >
                <Warehouse stage={stage} close={closeWarehouseForm}/>
            </DialogToAddMiddleInvest>)}
        </React.Fragment>
    )
};

InvestForm.propTypes = {};

export default InvestForm;

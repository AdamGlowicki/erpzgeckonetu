import React, {useEffect, useReducer, useState} from 'react';
import styled, {keyframes, css} from 'styled-components'
import DeveloperBoardIcon from "@material-ui/icons/DeveloperBoard";
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextArea from "../../atoms/textArea/TextArea";
import {patchData, postData, postFile} from "../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {useDispatch, useSelector} from "react-redux";
import {ADD_INVESTMENT, IS_LOADING, UPDATE_MAIN_INVEST} from "../../../reducers/investments/duck/reduxType";
import {getToday, limitStringWithoutDots} from "../../../common/globalMethods";
import GenerateInvestFiles from "../generateInvestFiles/GenerateInvestFiles";
import BriefcaseInputs from "./BriefcaseInputs";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import RemoveMiddleStage from "../removeMiddleStage/RemoveMiddleStage";

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
  width: 50vw;
  height: 60vh;
  display: grid;
  grid-template-columns: 35% 65%;
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
  justify-content: space-between;
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


const InvestmentBriefcase = ({stage, setOpen}) => {

    const [cookies, setCookie] = useCookies(['name'])

    const updateMainInvest = useDispatch();
    const saveMainInvest = useDispatch();
    const setLoading = useDispatch();
    const setError = useDispatch();

    const [allowSave, setAllowSave] = useState(true);

    let {id, country, stage_name, adder, add_date, description, address, files} = stage;

    useEffect(() => {
        country === null && (country = '');
        stage_name === null && (stage_name = '');
        adder === null && (adder = '');
        add_date === null && (add_date = getToday());
        description === null && (description = '');
        address === null && (address = '');

        setInputContent({
            country,
            stage_name,
            adder,
            add_date,
            description,
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
            description: '',
            address: '',
        }
    );

    const [inputValidate, setInputValidate] = useReducer((prevState, state) => ({...prevState, ...state}), {
        country: false,
        stage_name: false,
        add_date: false,
    })

    const handleInput = (e) => {
        let {value, name} = e.target;
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
        return permission
    }

    const handleSave = async () => {
        const permission = validate()
        setAllowSave(permission)
        if (permission) {
            id ? await asyncUpdateInvestData() : await asyncSaveInvestData();
            setOpen(false)
        }
    }

    const asyncSaveInvestData = async () => {
        setLoading({type: IS_LOADING, payload: true});
        try {
            const result = await postData(`/invest`, {
                ...inputsContent,
                parent_id: null,
                main: 1,
                level: 0,
                investment_id: null,
            }, cookies)
            saveMainInvest({type: ADD_INVESTMENT, payload: {...result.data}})
        } catch (e) {
            setLoading({type: IS_LOADING, payload: false});
            setError({isError: true, errorMessage: `Nie udalo się zmienić aktualizować inwestycji.`});
        }
        setLoading({type: IS_LOADING, payload: false});
    }

    const asyncUpdateInvestData = async () => {
        setLoading({type: IS_LOADING, payload: true});
        try {
            const result = await patchData(`/invest/${id}`, {
                ...inputsContent,
            }, cookies)
            updateMainInvest({type: UPDATE_MAIN_INVEST, payload: {id, data: result.data}})
        } catch (e) {
            setError({isError: true, errorMessage: `Nie udalo się zmienić aktualizować inwestycji.`});

        }
        setLoading({type: IS_LOADING, payload: false});
    }

    return (
        <React.Fragment>
            <StyledWrapper>

                <StyledHead>
                    <div className='d-flex'>
                        <DeveloperBoardIcon/>
                        <div className='ml-2'>{stage_name ? stage_name : 'Nowa teczka dla inwestycji'}</div>
                    </div>
                </StyledHead>

                <StyledInputSection>
                    <StyledTitle>
                        Dane Inwestycji
                    </StyledTitle>
                    <BriefcaseInputs stage={stage} handleInput={handleInput} inputsContent={inputsContent}
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
                    <div className='mt-4'>
                        {files && (<GenerateInvestFiles stage={stage}/>)}
                    </div>

                </StyledContent>

                <StyledButtonSection>
                    {id && (<RemoveMiddleStage adder={adder} main stageId={id} stageName={country}/>)}

                    <StyledShakeButton error={!allowSave}>
                        <ColorButton second='true' onClick={handleSave} variant="contained"
                                     color="primary">{id ? 'Aktualizuj' : 'Zapisz'}</ColorButton>
                    </StyledShakeButton>
                </StyledButtonSection>

            </StyledWrapper>
        </React.Fragment>
    )
};

export default InvestmentBriefcase;

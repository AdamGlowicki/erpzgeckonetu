import React, {useEffect, useReducer, useState} from 'react';
import styled, {css, keyframes} from 'styled-components';
import AddWarehouseItems from "../addWarehouseItems/AddWarehouseItems";
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import {IS_LOADING, UPDATE_INVESTMENT_ID} from "../../../reducers/investments/duck/reduxType";
import {getData, patchData, postFile, putByFormData} from "../../../common/apiMethods/apiMethods";
import {useDispatch, useSelector} from "react-redux";
import WarehouseInputs from "./WatrhouseInputs";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {useCookies} from "react-cookie";
import {limitStringWithoutDots} from "../../../common/globalMethods";
import {getAllWarehouseInvestments} from "../../../reducers/watehouseInvestment/duck/operations";

const extension = keyframes`
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
`

const StyledWrapper = styled.section`
  width: 90vw;
  min-height: 50vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 300px 1fr;
  animation: ${extension} 1s;
`

const StyledHead = styled.div`
    grid-row: 1 / 2;
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
`

const slide = keyframes`
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
`

const StyledInputSection = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  animation: ${slide} 1s;
  transform-origin: 0 0;
`

const StyledContentSection = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
`

const StyledButtonSection = styled.div`
  grid-row: 3 / -1;
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
`

const StyledInfoInvest = styled.div.attrs({
    className: 'mt-3'
})`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

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

const StyledInfoItem = styled.div.attrs({
    className: 'ml-2 mb-3'
})`
    border-bottom: 1px solid black;
    max-width: 250px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
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


const Warehouse = ({...props}) => {
    const {stage, close} = props

    const [allowSave, setAllowSave] = useState(true);
    const [items, setItems] = useState([]);
    const [newItems, setNewItems] = useState([]);

    const setLoading = useDispatch();
    const setError = useDispatch();
    const getWarehouseInvestmentWithDispatch = useDispatch()
    const updateInvestmentId = useDispatch()

    const cars = useSelector(state => state.warehouse.cars)
    const warehouses = useSelector(state => state.warehouse.warehouses)
    const warehouseInvestment = useSelector(state => state.warehouse.investments.filter(item => item.id === stage.investment_id));

    const [cookies, setCookie] = useCookies(['name'])

    const [inputsContent, setInputContent] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            realized: {name: ''},
            inv_code: '',
            warehouse: {name: ''},
            num_type: '',
        }
    );

    const [inputValidate, setInputValidate] = useReducer((prevState, state) => ({...prevState, ...state}), {
        inv_code: false,
        warehouse: false,
        realized: false,
        num_type: false,
    })
    const asyncGetItemsToInvest = async () => {
        try {
            const result = await getData(`/investment/${stage.investment_id}/edit`, cookies)
            setItems(result.data.investments_queue_item);
        } catch (e) {

        }
    }

    useEffect(() => {
        asyncGetItemsToInvest()
        if (warehouseInvestment.length) {
            let {warehouse_id, num_city: inv_code, car_id, num_type} = warehouseInvestment[0];

            setInputContent({
                realized: cars.filter(({id}) => id === car_id).length ? cars.filter(({id}) => id === car_id)[0] : {name: ''},
                inv_code,
                warehouse: warehouses.filter(({id}) => id === warehouse_id).length ? warehouses.filter(({id}) => id === warehouse_id)[0] : {name: ''},
                num_type,
            })
        }

    }, [])

    useEffect(() => {
        const handler = setTimeout(() => setAllowSave(true), 1000)
        return () => {
            clearTimeout(handler)
        }
    }, [allowSave])

    const handleInput = (e) => {
        let {value, name} = e.target;
        console.log(value)
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

        if (!inputsContent.realized.name.length) {
            setInputValidate({realized: true})
            permission = false
        }
        if (!inputsContent.inv_code.length) {
            setInputValidate({inv_code: true})
            permission = false
        }
        if (inputsContent.inv_code.length !== 3) {
            setInputValidate({inv_code: true})
            permission = false
        }
        if (!inputsContent.warehouse.name.length) {
            setInputValidate({warehouse: true})
            permission = false
        }
        if (!inputsContent.num_type.length) {
            setInputValidate({num_type: true})
            permission = false
        }
        return permission
    }

    const asyncSaveInvestData = async () => {
        const itemsToSave = newItems.map(item => ({add_to_request: item.supply, item_id: item.item.id, quantity: item.quantity, quantity_used: 0, comment: '',}))

        const formdata = new FormData();

        formdata.append('name', stage.stage_name)
        formdata.append('car_id', inputsContent.realized.id)
        formdata.append('num_city', inputsContent.inv_code)
        formdata.append('num_type', inputsContent.num_type)
        formdata.append('warehouse_id', inputsContent.warehouse.id)
        formdata.append('date_start', stage.add_date)
        formdata.append('date_end', stage.deadline)
        formdata.append('items', JSON.stringify(itemsToSave))

        setLoading({type: IS_LOADING, payload: true});

        try {
            if (warehouseInvestment.length) {
                formdata.append('_method', 'PUT')
                const update = await postFile(`/investment/${warehouseInvestment[0].id}`, formdata, cookies)
                getWarehouseInvestmentWithDispatch(getAllWarehouseInvestments(cookies));
            } else {
                const res = await postFile('/investment', formdata, cookies);
                const update = await patchData(`/invest/${stage.id}`, {investment_id: res.data.id}, cookies)
                updateInvestmentId({type: UPDATE_INVESTMENT_ID, payload: {id: stage.id, investment_id: res.data.id}})
                getWarehouseInvestmentWithDispatch(getAllWarehouseInvestments(cookies));
            }
        } catch (e) {
            setError({isError: true, errorMessage: `Nie udalo się zmienić aktualizować inwestycji.`});

        }
        setLoading({type: IS_LOADING, payload: false});
    }

    const handleSave = async () => {
        const permission = validate()
        setAllowSave(permission)
        if (permission) {
            await asyncSaveInvestData();

            close()
        } else {
        }
    }

    return (
        <StyledWrapper>
            <StyledHead>
                <div className='ml-2'>
                    <ChromeReaderModeIcon fontSize='large'/>
                </div>
                <div style={{fontSize: '16px', fontWeight: '200'}} className='ml-2'>
                    {warehouseInvestment.length ? `Zaopatrzenie inwestycji ${stage.stage_name}` : `Dodaj stan magazynowy inwestycji ${stage.stage_name}`}
                </div>
            </StyledHead>

            <StyledInputSection>
                <StyledInfoInvest>
                    <StyledInfoItem><span
                        style={{fontWeight: 'bold'}}>Nazwa:</span> {stage.stage_name}</StyledInfoItem>
                    <StyledInfoItem><span style={{fontWeight: 'bold'}}>Rozpoczęcie:</span> {stage.add_date}
                    </StyledInfoItem>
                    <StyledInfoItem><span style={{fontWeight: 'bold'}}>Zakończenie:</span> {stage.deadline}
                    </StyledInfoItem>
                </StyledInfoInvest>
                <WarehouseInputs
                    disabled={warehouseInvestment.length}
                    stage={stage}
                    handleInput={handleInput}
                    inputsContent={inputsContent}
                    inputValidate={inputValidate}
                />
            </StyledInputSection>

            <StyledContentSection>
                <AddWarehouseItems items={items} newItems={newItems} setNewItems={setNewItems} {...props}/>
            </StyledContentSection>

            <StyledButtonSection>
                <StyledShakeButton error={!allowSave}>
                    <ColorButton second='true' onClick={handleSave} variant="contained"
                                 color="primary">Zapisz</ColorButton>
                </StyledShakeButton>
            </StyledButtonSection>
        </StyledWrapper>
    );
};

export default Warehouse;

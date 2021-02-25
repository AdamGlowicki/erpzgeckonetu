import React, {useContext, useEffect, useMemo, useState} from 'react';
import styled, {css, keyframes} from 'styled-components';
import {useForm} from "react-hook-form";
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import {carsBrand} from "../../../../enums/carBrends";
import {useDispatch, useSelector} from "react-redux";
import {deleteData, patchData, postData, postFile} from "../../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {useParams} from "react-router";
import {fetchCars} from "../../../../reducers/car";
import {getToday} from "../../../../common/globalMethods";
import Input from "../../atoms/input/Input";
import {CarContext} from "../carDetail/CarDetail";
import {CarServiceDataContext} from "../carServiceRouter/CarServiceRouter";
import CircularProgress from '@material-ui/core/CircularProgress';

const carAnimation = keyframes`
 0%, 20% {color: black; transform: rotateY(0) scale(1)}
 40%, 60% {color: green; transform: rotateY(360deg) scale(1.3)}
 80%, 100% {color: black; transform: rotateY(0) scale(1)}
`

const StyledWrapper = styled.div`
  background-color:#fff;
  min-width: 80%;
  height: auto;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 7px 6px 16px -5px rgba(0,0,0,0.58);
  border: 2px solid whitesmoke;
`

const CarIcon = styled(DirectionsCarIcon).attrs({
    className: 'mr-2'
})`
  animation: ${carAnimation} 5s infinite;
  animation-delay: 4s;
`

const StyledSelect = styled.select`
  min-width: 40%;
  border: 1px solid black;
  border-radius: 4px;
  padding: 4px;
  transition: 200ms;
  font-size: 12px;

   &:focus {
    outline: none;
    border-color: yellowgreen;
  }

  &::-webkit-scrollbar{
  width: 5px;
  }
  &::-webkit-scrollbar-track {
  background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
  background: #ac0;
  }
`

const Fieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const StyledLabel = styled.label.attrs({
    className: 'mt-2 ml-1'
})`
  font-size: 12px;
  margin-bottom: 4px;
  font-weight: 400;
`

const StyledInputUnit = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const StyledUnit = styled.div.attrs({
    className: 'ml-2'
})`
  font-weight: 400;
  font-size: 12px;
`

const StyledTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
`

const StyledError = styled.div`
 color: red;
 font-size: 10px;
 font-weight: 600;
 margin-left: 4px;
`

const StyledButton = styled.button`
  border-radius: 4px;
  border: 1px solid whitesmoke;
  background-color: yellowgreen;
  padding: 4px;
  color: white;
  font-weight: 600;
  align-self: flex-end;
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({second}) => (
    second && css`
      background-color: red;
  `
)}
`

const Section = styled.div.attrs({
    className: 'p-2 pr-4 mt-4 pt-3'
})`
  position: relative;
  min-width: 80%;
  display: flex;
  flex-direction: column;
  border: 2px solid ${props => props.border};
  border-radius: 8px;
`

const SectionLabel = styled.div`
  position: absolute;
  left: 8px;
  top: -16px;
  font-size: 14px;
  font-weight: 500;
  padding: 4px;
  background-color:#fff;
  border-radius: 14px;
  border: 2px solid ${props => props.border};
`

const CarForm = ({car = {}, userId, setUserId}) => {
    const [cookies,] = useCookies()
    const {id: numberPlate} = useParams();
    const [isGas, setIsGas] = useState(false);
    const [loading, setLoading] = useState(false);
    const {photosData, setPhotosData, setAlert} = useContext(CarContext);
    const {getAlerts, permission, adminPermission} = useContext(CarServiceDataContext);

    const dispatch = useDispatch();
    const users = useSelector(state => state.user.users);
    const {register, handleSubmit, errors} = useForm({
        mode: 'onBlur'
    });

    const memoCar = useMemo(() =>
            car
        , [car])

    useEffect(() => {
        setIsGas(!!car.isGas)
        setUserId(car.user_id)
    }, [])

    const onSubmit = async (data, numberPlate) => {
        setLoading(true)
        let carId = car.id;
        try {
            if (car.id) {
                await updateCar(data)
                await deleteAlert(car)
                await getAlerts(cookies)
            } else {
                carId = await addCar({...data, numberPlate})
            }

            if (photosData.photoData) {
                await asyncAddPhoto(photosData.photoData, carId, 'main', cookies, () => setPhotosData({photoData: null}))
            }
            if (photosData.registrationAvers) {
                await asyncAddPhoto(photosData.registrationAvers, carId, 'avers', cookies, () => setPhotosData({registrationAvers: null}))
            }
            if (photosData.registrationRevers) {
                await asyncAddPhoto(photosData.registrationRevers, carId, 'revers', cookies, () => setPhotosData({registrationRevers: null}))
            }
            if (photosData.insurance) {
                await asyncAddPhoto(photosData.insurance, carId, 'insurance', cookies, () => setPhotosData({insurance: null}))
            }
            if (photosData.carCard) {
                await asyncAddPhoto(photosData.carCard, carId, 'carCard', cookies, () => setPhotosData({carCard: null}))
            }
            if (photosData.licenceAvers) {
                await asyncAddUserPhoto(photosData.licenceAvers, userId, 'avers', cookies, () => setPhotosData({licenceAvers: null}))
            }
            if (photosData.licenceRevers) {
                await asyncAddUserPhoto(photosData.licenceRevers, userId, 'revers', cookies, () => setPhotosData({licenceRevers: null}))
            }
            if (photosData.doc) {
                await asyncAddUserPhoto(photosData.doc, userId, 'doc', cookies, () => setPhotosData({doc: null}))
            }

            dispatch(fetchCars(cookies))
            setAlert({open: true, type: 'success', message: 'Pomyślnie zaktualizowano'})
            setLoading(false)
        } catch (e) {
            setLoading(false)
            setAlert({open: true, type: '', message: 'Coś poszło nie tak, skontaktuj się z administratorem'})
        }

    };

    const addCar = async data => {
        const result = await postData('/automobile/add', {...data}, cookies)
        return result.data.id
    }

    const updateCar = async (data) => {
        await patchData(`automobile/patch/${car.id}`, {...data}, cookies)
    }

    const deleteAlert = async (car) => {
        await deleteData(`/alertsCars/delete/${car.id}`, cookies)
    }

    const asyncAddPhoto = async (file, carId, type, cookies, callback) => {
        const photoData = new FormData()
        photoData.append('carPhoto', file)
        photoData.append('automobile_id', carId)
        photoData.append('type', type)
        await postFile('/carPhoto', photoData, cookies)
        callback()
    }

    const asyncAddUserPhoto = async (file, userId, type, cookies, callback) => {
        const photoData = new FormData()
        photoData.append('userPhoto', file)
        photoData.append('user_id', userId)
        photoData.append('type', type)
        await postFile('/userPhoto', photoData, cookies)
        callback(null)
    }

    return (
        <StyledWrapper>
            <div className='d-flex flex-row align-items-center pt-3 pb-4'>
                <CarIcon/>
                <StyledTitle>Dane samochodu</StyledTitle>
            </div>
            <form
                onSubmit={handleSubmit((data) => onSubmit(data, numberPlate))}
            >
                <Fieldset disabled={!(adminPermission || permission.admin || permission.warehouseman)}>
                    <div className='d-flex flex-row justify-content-start align-items-center w-100 mb-2'>
                        <input
                            id='gas'
                            type='checkbox'
                            name='isGas'
                            onChange={(e) => setIsGas(e.target.checked)}
                            checked={isGas}
                            ref={register}
                        />
                        <StyledLabel htmlFor='gas'>Zainstalowany gaz</StyledLabel>
                    </div>

                    <Section border='yellowgreen'>
                        <SectionLabel border='yellowgreen'>Dane pojazdu</SectionLabel>

                        <StyledLabel>Kierowca</StyledLabel>
                        <StyledSelect
                            name='user_id'
                            value={userId}
                            onChange={({target: {value}}) => setUserId(value)}
                            ref={register({required: true})}
                        >
                            {users.map(user => (
                                <option value={user.id} key={user.id}>{user.name}</option>
                            ))}
                        </StyledSelect>
                        {errors.drive && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Marka auta</StyledLabel>
                        <StyledSelect
                            placeholder='Marka'
                            name='brand'
                            defaultValue={memoCar == null ? undefined : memoCar.brand}
                            ref={register({required: true, minLength: 3, maxLength: 10})}
                        >
                            {carsBrand.map(car => (
                                <option value={car} key={car}>{car}</option>
                            ))}
                        </StyledSelect>

                        <StyledLabel>Model auta</StyledLabel>
                        <StyledInputUnit>
                            <Input
                                placeholder='Model'
                                name='model'
                                type='text'
                                defaultValue={memoCar == null ? undefined : memoCar.model}
                                refData={register({required: true, minLength: 2, maxLength: 10})}
                            />
                        </StyledInputUnit>
                        {errors.model == null ? undefined : errors.model.type === 'required' && (
                            <StyledError>Wymagene pole</StyledError>)}
                        {errors.model == null ? undefined : errors.model.type === 'minLength' && (
                            <StyledError>Min 2 znaki</StyledError>)}
                        {errors.model == null ? undefined : errors.model.type === 'maxLength' && (
                            <StyledError>Max 10 znaków</StyledError>)}

                        <StyledLabel>Numer rejestracyjny</StyledLabel>
                        <StyledInputUnit>
                            <Input
                                placeholder='Rejestracja'
                                name='numberPlate'
                                type='text'
                                minlength='4'
                                maxlength='9'
                                defaultValue={numberPlate}
                                refData={register({required: true, minLength: 4, maxLength: 9})}
                                uppercase
                                disabled
                            />
                        </StyledInputUnit>
                        {errors.numberPlate == null ? undefined : errors.numberPlate.type === 'required' && (
                            <StyledError>Wymagene pole</StyledError>)}
                        {errors.numberPlate == null ? undefined : errors.numberPlate.type === 'minLength' && (
                            <StyledError>Min 4 znaki</StyledError>)}
                        {errors.numberPlate == null ? undefined : errors.numberPlate.type === 'maxLength' && (
                            <StyledError>Max 9 znaków</StyledError>)}

                        <StyledLabel>Numer VIN</StyledLabel>
                        <StyledInputUnit>
                            <Input
                                placeholder='VIN'
                                name='vin'
                                type='tekst'
                                maxlength={17}
                                defaultValue={memoCar == null ? undefined : memoCar.vin}
                                refData={register({
                                    required: true,
                                    pattern: /^[A-HJ-NPR-Za-hj-npr-z\d]{8}[\dX][A-HJ-NPR-Za-hj-npr-z\d]{2}\d{6}$/
                                })}
                                uppercase
                            />
                        </StyledInputUnit>
                        {errors.vin == null ? undefined : errors.vin.type === 'required' && (
                            <StyledError>Wymagane pole</StyledError>)}
                        {errors.vin == null ? undefined : errors.vin.type === 'pattern' && (
                            <StyledError>Nieprawidłowy numer VIN</StyledError>)}
                    </Section>

                    <Section border='silver'>
                        <SectionLabel border='silver'>Interwały mechaniczne</SectionLabel>
                        <StyledLabel>Interwał olejowy</StyledLabel>
                        <StyledInputUnit>
                            <Input
                                placeholder='Interwał'
                                name='oil'
                                type='number'
                                min={0}
                                max={50000}
                                step={500}
                                defaultValue={memoCar == null ? undefined : memoCar.oil}
                                refData={register({required: true})}
                            />
                            <StyledUnit>km</StyledUnit>
                        </StyledInputUnit>
                        {errors.oil && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Data wymiany oleju</StyledLabel>
                        <Input
                            placeholder='Data wymiany oleju'
                            name='oilPeriodDate'
                            type='date'
                            defaultValue={memoCar.gasDate == null ? undefined : memoCar.oilPeriodDate}
                            refData={register({required: true})}
                        />
                        {errors.oilPeriodDate && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Interwał przegląd ogólny</StyledLabel>
                        <StyledInputUnit>
                            <Input
                                placeholder='Interwał'
                                name='periodService'
                                type='number'
                                min={0}
                                max={50000}
                                step={500}
                                defaultValue={memoCar == null ? undefined : memoCar.periodService}
                                refData={register({required: true})}
                            />
                            <StyledUnit>km</StyledUnit>
                        </StyledInputUnit>
                        {errors.periodService && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Data następnego przeglądu</StyledLabel>
                        <Input
                            placeholder='Data przeglądu'
                            name='periodServiceDate'
                            type='date'
                            defaultValue={memoCar.gasDate == null ? undefined : memoCar.periodServiceDate}
                            refData={register({required: true})}
                        />
                        {errors.periodServiceDate && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Interwał wymiany napędu rozrządu</StyledLabel>
                        <StyledInputUnit>
                            <Input
                                placeholder='Interwał'
                                name='timingGear'
                                type='number'
                                min={0}
                                max={180000}
                                step={1000}
                                defaultValue={memoCar == null ? undefined : memoCar.timingGear}
                                refData={register({required: true})}
                            />
                            <StyledUnit>km</StyledUnit>
                        </StyledInputUnit>
                        {errors.timingGear && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Data wymiany rozrządu</StyledLabel>
                        <Input
                            placeholder='Data przeglądu'
                            name='periodTimingGearDate'
                            type='date'
                            defaultValue={memoCar.gasDate == null ? undefined : memoCar.periodTimingGearDate}
                            refData={register({required: true})}
                        />
                        {errors.periodTimingGearDate && (<StyledError>To pole jest wymagane</StyledError>)}
                    </Section>

                    <Section border='blue'>
                        <SectionLabel border='blue'>Układ paliwiwy</SectionLabel>

                        <StyledLabel>Interwał przeglądów paliwowych</StyledLabel>
                        <StyledInputUnit>
                            <Input
                                placeholder='Interwał'
                                name='fuelInspection'
                                type='number'
                                min={0}
                                max={50000}
                                step={500}
                                defaultValue={memoCar == null ? undefined : memoCar.fuelInspection}
                                refData={register({required: true})}
                            />
                            <StyledUnit>km</StyledUnit>
                        </StyledInputUnit>
                        {errors.fuelInspection && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Data następnego przeglądu</StyledLabel>
                        <StyledInputUnit>
                            <Input
                                placeholder='Data'
                                name='fuelPeriodDate'
                                type='date'
                                defaultValue={memoCar == null ? undefined : memoCar.fuelPeriodDate}
                                refData={register({required: true})}
                            />
                        </StyledInputUnit>
                        {errors.fuelPeriodDate && (<StyledError>To pole jest wymagane</StyledError>)}
                    </Section>

                    {isGas && (
                        <Section border='lightblue'>
                            <SectionLabel border='lightblue'>Interwały gazowe</SectionLabel>

                            <StyledLabel>Interwał przegląd gazowy</StyledLabel>
                            <StyledInputUnit>
                                <Input
                                    placeholder='Interwał'
                                    name='gasInstallation'
                                    type='number'
                                    min={0}
                                    max={50000}
                                    step={500}
                                    defaultValue={memoCar == null ? undefined : memoCar.gasInstallation}
                                    refData={register({required: true})}
                                />
                                <StyledUnit>km</StyledUnit>
                            </StyledInputUnit>
                            {errors.gasInstallation && (<StyledError>To pole jest wymagane</StyledError>)}

                            <StyledLabel>Następny przegląd gazowy</StyledLabel>
                            <Input
                                placeholder='Data przeglądu'
                                name='gasDate'
                                type='date'
                                defaultValue={memoCar.gasDate == null ? undefined : memoCar.gasDate}
                                refData={register({required: true})}
                            />
                            {errors.gasDate && (<StyledError>To pole jest wymagane</StyledError>)}

                            <StyledLabel>Data homologacji</StyledLabel>
                            <Input
                                placeholder='Data homologacji gazu'
                                name='gasHomologous'
                                type='date'
                                defaultValue={memoCar == null ? undefined : memoCar.gasHomologous}
                                refData={register({required: true})}
                            />
                            {errors.gasHomologous && (<StyledError>To pole jest wymagane</StyledError>)}
                        </Section>
                    )}

                    <Section border='black'>
                        <SectionLabel border='black'>Opony</SectionLabel>

                        <StyledLabel>Wymiana opon na letnie</StyledLabel>
                        <StyledInputUnit>
                            <Input
                                placeholder='Data'
                                name='summerChangeTire'
                                type='date'
                                defaultValue={memoCar == null ? undefined : memoCar.summerChangeTire}
                                refData={register({required: true})}
                            />
                        </StyledInputUnit>
                        {errors.summerChangeTire && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Wymiana opon na zimowe</StyledLabel>
                        <StyledInputUnit>
                            <Input
                                placeholder='Data'
                                name='winterChangeTire'
                                type='date'
                                defaultValue={memoCar == null ? undefined : memoCar.winterChangeTire}
                                refData={register({required: true})}
                            />
                        </StyledInputUnit>
                        {errors.winterChangeTire && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Stan opon zimowych</StyledLabel>
                        <StyledSelect
                            name='snowTire'
                            defaultValue={memoCar == null ? undefined : memoCar.snowTire}
                            ref={register({required: true})}
                        >
                            <option value={1}>Dobry</option>
                            <option value={2}>Średni</option>
                            <option value={3}>Do wymiany</option>
                        </StyledSelect>
                        {errors.snowTire && (<StyledError>To pole jest wymagane</StyledError>)}


                        <StyledLabel>Stan opon letnich</StyledLabel>
                        <StyledSelect
                            name='summerTire'
                            defaultValue={memoCar == null ? undefined : memoCar.summerTire}
                            ref={register({required: true})}
                        >
                            <option value={1}>Dobry</option>
                            <option value={2}>Średni</option>
                            <option value={3}>Do wymiany</option>
                        </StyledSelect>
                        {errors.summerTire && (<StyledError>To pole jest wymagane</StyledError>)}
                    </Section>

                    <Section border='brown'>
                        <SectionLabel border='brown'>Pozostałe dane</SectionLabel>

                        <StyledLabel>Ważność ubezpieczenia</StyledLabel>
                        <Input
                            placeholder='Ubezpieczenie'
                            name='insurance'
                            type='date'
                            defaultValue={memoCar == null ? undefined : memoCar.insurance}
                            refData={register({required: true})}
                        />
                        {errors.insurance && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Następny przegląd techniczny</StyledLabel>
                        <Input
                            placeholder='Przegląd'
                            name='techPeriod'
                            type='date'
                            defaultValue={memoCar == null ? undefined : memoCar.techPeriod}
                            refData={register({required: true})}
                        />
                        {errors.techPeriod && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Data założenia karty samochodu</StyledLabel>
                        <Input
                            name='create'
                            type='date'
                            defaultValue={memoCar == null ? getToday() : memoCar.create}
                            refData={register({required: true})}
                        />
                        {errors.create && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Data homologacji</StyledLabel>
                        <Input
                            name='approval'
                            type='date'
                            defaultValue={memoCar == null ? undefined : memoCar.approval}
                            refData={register({required: true})}
                        />
                        {errors.approval && (<StyledError>To pole jest wymagane</StyledError>)}

                        <StyledLabel>Numer polisy</StyledLabel>
                        <Input
                            name='insuranceNumber'
                            type='text'
                            placeholder='Nr. polisy'
                            defaultValue={memoCar == null ? undefined : memoCar.insuranceNumber}
                            refData={register({required: true})}
                        />
                        {errors.insuranceNumber && (<StyledError>To pole jest wymagane</StyledError>)}
                    </Section>

                    <StyledButton
                        className='mt-2'
                        type='submit'
                        disabled={loading}
                    >
                        {car.id ? 'Aktualizuj' : 'Zapisz'}
                        {loading ? <CircularProgress size={15} style={{color: 'white'}} className='ml-1'/> : null}
                    </StyledButton>
                </Fieldset>
            </form>
        </StyledWrapper>
    );
};

export default CarForm;

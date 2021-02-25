import React, {useContext, useEffect, useReducer, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import Photo from "../carPhoto/Photo";
import CarForm from "../carForm/CarForm";
import CarPresentation from "../carPresentation/CarPresentation";
import CustomLink from "../../../atoms/customLink/CustomLink";
import {useSelector} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useHistory, useParams} from "react-router";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import Alert from "../Alert/Alert";
import Photos from "../photos/Photos";
import {getData, handleErrorApi} from "../../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {removeWhiteChart} from "../../../../common/globalMethods";
import ActionAlert from "../actionAlert/ActionAlert";
import {CarServiceDataContext} from "../carServiceRouter/CarServiceRouter";
import {getAlertsByCarId} from "../../autils";
import CarInvoices from "../carInvoices/CarInvoices";

const slide = keyframes`
  from {transform: scaleX(0); opacity: 0}
  to {transform: scaleX(1); opacity: 1}
`

const StyledWrapper = styled.div.attrs({
    className: 'p-1'
})`
  box-sizing: border-box;
  width: 70vw;
  min-height: 80vh;
  display: grid;
  background-color: white;
  grid-gap: 16px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 3fr 1fr 6fr;
  grid-template-areas:
    'form data photo'
    'form alert alert'
    'form registration registration'
  ;
  border-radius: 16px;
  animation: ${slide} 500ms;
  transform-origin: left;
  padding-top: 16px;
  padding-bottom: 16px;
`

const StyledForm = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  grid-area: form;
`

const StyledPhoto = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  grid-area: photo;
`

const StyledData = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-area: data;
`

const LinkContent = styled.div.attrs({
    className: 'mt-3'
})`
  border-radius: 4px;
  border: 1px solid whitesmoke;
  background-color: yellowgreen;
  padding: 4px;
  color: white;
  font-weight: 600;
  font-size: 16px;
`

const StdAlert = styled.div`
  width: 100%;
  height: 100%;
  grid-area: alert;
`

export const CarContext = React.createContext(null);

const CarDetail = () => {
    const [navifleetData, setNavifleetData] = useReducer((prev, current) => ({...prev, ...current}),
        {
            cars: [],
            car: null,
        })
    const [photosData, setPhotosData] = useReducer((prev, current) => ({...prev, ...current}),
        {
            photoData: null,
            registrationAvers: null,
            registrationRevers: null,
            licenceAvers: null,
            licenceRevers: null,
            doc: null,
            insurance: null,
            carCard: null
        })
    const [car, setCar] = useState({});
    const [display, setDisplay] = useState(false);
    const [userId, setUserId] = useState(undefined);
    const [alerts, setAlerts] = useState([]);
    const [alert, setAlert] = useState({});

    const {id: numberPlate} = useParams();
    const [cookies,] = useCookies();
    const history = useHistory();

    const cars = useSelector(item => item.cars.cars);
    const navifleetCars = useSelector(item => item.cars.navifleetCars);

    const {alerts: contextAlerts, permission, adminPermission, loggedUser} = useContext(CarServiceDataContext);

    useEffect(() => {
        if (cars.length && Object.keys(permission).length && loggedUser) {
            const car = getCarByNumberplate(numberPlate, cars)

            redirectIfUserNotAssignToCar(car, permission)

            setCar(car)
        }
    }, [cars, permission, loggedUser])

    useEffect(() => {
        if (car && contextAlerts.length) {
            const alerts = getAlertsByCarId(car.id, contextAlerts)
            alerts ? setAlerts(alerts) : null
        }
    }, [car, contextAlerts])

    useEffect(() => {
        if (cars.length && navifleetCars.length) {
            setNavifleetData({cars: navifleetCars})
        }
    }, [cars, navifleetCars,])

    const getNavifleetCarIdByNumberPlate = (cars, numberPlate) => {
        return cars.reduce((prev, current) => {
            return removeWhiteChart(current.license) === numberPlate ? [...prev, current.id] : prev
        }, [])
    }

    const fetchNavifleetCar = handleErrorApi(async (cookies, id) => {
        const data = await getData(`navifleet/car/${id}`, cookies)
        setNavifleetData({
            car: data.data.data
        })
    })

    const getCarByNumberplate = (numberPlate, cars) => (
        cars.find(item => removeWhiteChart(item.numberPlate) === removeWhiteChart(numberPlate))
    )


    const redirectIfUserNotAssignToCar = (car = {}, permission) => {
        if ((car.user_id !== permission.user_id) && !(adminPermission || permission.warehouseman || permission.admin)) {
            history.push('/react/404')
        }
    }

    useEffect(() => {
        if (navifleetCars.length) {
            const id = getNavifleetCarIdByNumberPlate(navifleetCars, numberPlate)[0];
            fetchNavifleetCar(cookies, id)

            const navifleetCar = navifleetCars.find(car => removeWhiteChart(car.license) === removeWhiteChart(numberPlate))
            navifleetCar || history.push('/react/404')
        }
    }, [navifleetCars])

    useEffect(() => {
        if (navifleetData.car) {
            setDisplay(true)
        }
    }, [navifleetData])

    const getCarPhotoByType = (type, car) => {
        if (car) {
            return car.car_photo.find(photo => photo.type === type)
        }
        return null
    }

    return (
        <CarContext.Provider value={{
            navifleetData,
            setNavifleetData,
            photosData,
            setPhotosData,
            alert,
            setAlert,
        }}>
            {display ? (
                <StyledWrapper>
                    <StyledForm>
                        <CarForm
                            car={car}
                            userId={userId}
                            setUserId={setUserId}
                        />
                    </StyledForm>

                    <StyledData>
                        <CarPresentation/>

                        {(permission.admin || permission.warehouseman || adminPermission && car) ? <CarInvoices car={car}/> : null}

                        <CustomLink to='/react/carService'>
                            <LinkContent>Samochody</LinkContent>
                        </CustomLink>
                    </StyledData>

                    <StyledPhoto>
                        <Photo
                            second
                            photo={getCarPhotoByType('main', car)}
                            type='main'
                            url='carPhoto'
                            keyValue='photoData'
                            photoData={photosData.photoData}
                            setPhotoData={setPhotosData}
                            carId={car == null ? undefined : car.id}
                            icon={
                                <AddPhotoAlternateIcon
                                    style={{color: 'yellowgreen'}}
                                    fontSize='large'
                                />
                            }
                            deleteUrl='carPhoto'
                        />
                    </StyledPhoto>

                    <StdAlert>
                        <Alert alerts={alerts}/>
                    </StdAlert>

                    <Photos
                        car={car}
                        photosData={photosData}
                        setPhotosData={setPhotosData}
                        userId={userId}
                    />
                </StyledWrapper>
            ) : (
                <CircularProgress style={{color: 'yellowgreen'}}/>
            )}

            <ActionAlert/>
        </CarContext.Provider>


    );
};

export default CarDetail;

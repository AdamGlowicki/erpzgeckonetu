import React, {Fragment, useContext, useEffect, useState} from 'react';
import styled, {keyframes, css} from 'styled-components';
import PersonIcon from '@material-ui/icons/Person';
import NumberPlate from "../../atoms/numberPlate/NumberPlate";
import CustomLink from "../../../atoms/customLink/CustomLink";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import {useSelector} from "react-redux";
import useCookies from "react-cookie/cjs/useCookies";
import {getFile, handleErrorApi} from "../../../../common/apiMethods/apiMethods";
import {removeWhiteChart} from "../../../../common/globalMethods";
import {CarServiceDataContext} from "../carServiceRouter/CarServiceRouter";
import {getAlertsByCarId} from "../../autils";
import DisplayAlerts from "../displayAlerts/DisplayAlerts";
import wheel from '../../../../common/icons/wheel.png'

const swing = keyframes`
  from {transform: rotate(-30deg); color: red}
  to {transform: rotate(30deg); color: darkred}
`

const slide = keyframes`
  from {transform: scaleX(0) scaleY(0); opacity: 0;}
  to {transform: scaleX(1) scaleY(1); opacity: 1;}
`

const rotate = keyframes`
  0% {transform: rotate(0) scale(1);}
  25% {transform: rotate(90deg) scale(1.1);}
  50% {transform: rotate(180deg) scale(1);}
  75% {transform: rotate(270deg) scale(1.1);}
  100% {transform: rotate(360deg) scale(1);}
`

const upDown = keyframes`
  from {transform: translateY(2px)}
  to {transform: translateY(-2px)}
`

const StyledWrapper = styled.div.attrs({
    className: 'p-2'
})`
  position:relative;
  width: 80%;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  animation: ${slide} 500ms;
  transform-origin: 0 0;
  box-shadow: 7px 6px 16px -5px rgba(0,0,0,0.58);
  ${({alert}) => (
    alert && css`
        border: 4px solid red;
      `
)}
`

const StyledImg = styled.img`
  position: relative;
  object-fit: contain;
  max-width: 90%;
  height: 220px;
  border-radius: 8px;
  transition: 300ms;
  transform-origin: center center;
  z-index: 5;

  :hover {
    z-index: 0;

    ${({animate}) => (
    animate && css`
          animation: ${upDown} 200ms linear infinite alternate;
    `
)}
  }
`

const StyledInfo = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(2, 1fr);
  grid-template-areas:
  'user numberLicence'
  'bell alert'
  ;
   align-items: center;
   justify-content: center;
`

const StyledSingleInfo = styled.div.attrs({
    className: 'w-100'
})`
  grid-area: ${props => props.area};
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: nowrap;
`

const Bell = styled(NotificationsActiveIcon).attrs({
    fontSize: 'large'
})`
  color: black;
  ${({alert}) => (
    alert && css`
        animation: ${swing} 300ms linear infinite alternate;
        transform-origin: top;
      `
)}
`

const Info = styled.div.attrs({
    className: 'p-2'
})`
  position: absolute;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background-color: darkred;
  z-index: 100;
`

const Hide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color:#000;
  opacity: 0.5;
  border-radius: 8px;
  z-index: 90;
`

const Wheel = styled.img`
  position: absolute;
  left: 12%;
  bottom: 15%;
  width: 45px;
  object-fit: contain;
  animation: ${rotate} linear 500ms infinite;
  z-index: 2;

  ${({second}) => (
    second && css`
      left: 53%;
      bottom: 11%;
  `
)}
`

const Car = ({license, index}) => {
    const [photo, setPhoto] = useState(null);
    const [cookies,] = useCookies();
    const [car, setCar] = useState(null)
    const [alerts, setAlerts] = useState([])
    const [display, setDisplay] = useState(false)

    const users = useSelector(state => state.user.users);
    const cars = useSelector(state => state.cars.cars);
    const {alerts: contextAlerts,} = useContext(CarServiceDataContext);

    const getCarByNumberPlate = (cars, numberPlate) => {
        return cars.find(item => removeWhiteChart(item.numberPlate) === removeWhiteChart(numberPlate))
    }

    useEffect(() => {
        if (cars.length) {
            const carByNumberPlate = getCarByNumberPlate(cars, license)
            if (carByNumberPlate) setCar(carByNumberPlate)
        }
    }, [cars])

    useEffect(() => {
        if (car && contextAlerts.length) {
            const alerts = getAlertsByCarId(car.id, contextAlerts)
            setAlerts(alerts)
        }
    }, [car, contextAlerts])

    const getUserName = (car) => {
        if (users.length && car) {
            return users.find(item => item.id === car.user_id) == null ? undefined : users.find(item => item.id === car.user_id).name
        }
    }

    const getPicture = handleErrorApi(async (id) => {
        const result = await getFile(`carPhoto/${id}/main`, cookies)
        setPhoto(result.data)
    })

    useEffect(() => {
        if (!photo && car) {
            car.car_photo.find(photo => photo.type === 'main') && getPicture(car.id)
        }
    }, [photo, car])

    useEffect(() => {
        const handle = setTimeout(() => setDisplay(true), (index * 100))

        return () => {
            clearTimeout(handle);
        }
    }, [])

    return (
        <Fragment>
            {display && (
                <StyledWrapper alert={alerts.length}>
                    {!car && <Info>Samochód niezapisany</Info>}

                    <CustomLink to={`/react/carService/${removeWhiteChart(license)}`}>
                        {!car && <Hide/>}

                        <div style={{position: 'relative'}} className='d-flex flex-row justify-content-center'>
                            {!photo ? (
                                <Fragment>
                                    <Wheel src={wheel}/>
                                    <Wheel second src={wheel}/>
                                </Fragment>
                            ) : null}

                            <StyledImg
                                animate={!photo}
                                src={photo ? URL.createObjectURL(photo) : 'https://www.mgexp.com/phile/1/147986/gekko_A.jpg'}
                            />
                        </div>

                        <StyledInfo>
                            <StyledSingleInfo area='user'>
                                <PersonIcon/>
                                {getUserName(car) ? getUserName(car) : 'Kierowca'}
                            </StyledSingleInfo>

                            <StyledSingleInfo area='numberLicence'>
                                <div className='w-100 d-flex flex-column align-items-center mt-1'>
                                    <NumberPlate license={license ? license : 'go geckonet'}/>
                                    <div className='d-flex flex-row'>
                                        <div className='mr-2' style={{fontSize: '12px', fontWeight: 600}}>{car && car.brand}</div>
                                        <div style={{fontSize: '12px', fontWeight: 600}}>{car && car.model}</div>
                                    </div>
                                </div>
                            </StyledSingleInfo>

                            <StyledSingleInfo area='bell'>
                                <Bell alert={alerts.length}/>
                            </StyledSingleInfo>

                            <DisplayAlerts second alerts={alerts}/>
                        </StyledInfo>
                    </CustomLink>
                </StyledWrapper>
            )}
        </Fragment>
    );
};

export default Car;

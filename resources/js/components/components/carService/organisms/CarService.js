import React, {Fragment, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import styled, {css, keyframes} from 'styled-components';
import Car from "../molecules/car/Car";
import {useSelector} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import {CarServiceDataContext} from "../molecules/carServiceRouter/CarServiceRouter";
import LinkAlert from "../molecules/linkAlert/LinkAlert";
import PaginationComponent from "../molecules/pagination/PaginationCoponent";
import Input from "../atoms/input/Input";
import {removeWhiteChart} from "../../../common/globalMethods";
import DraggableModal from "../../molecules/draggableModal/DraggableModal";
import IntervalForm from "../molecules/intervalForm/IntervalForm";
import {getData, handleErrorApi} from "../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import PermissionController from "../../globalComponents/permissionController/PermissionController";
import {useHistory} from "react-router";

const slide = keyframes`
  from {transform: scaleX(0)}
`

const pulse = keyframes`
  from {transform: scale(.95);}
  to {transform: scale(1.05);}
`

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12px;
  padding-bottom: 16px;
`

const CarsWrapper = styled.div`
  width: 90vw;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-row-gap: 24px;
  grid-template-columns: repeat(3, 1fr);
`

const TitleGroup = styled.div.attrs({
    className: 'm-3 ml-5'
})`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    animation: ${slide} 500ms;
    transform-origin: 0 0;
`

const Title = styled.h3.attrs({
    className: 'ml-3'
})`
  font-weight: 600;
`

const LinksGroup = styled.div.attrs({
    className: 'p-2 ml-5 mb-2'
})`
  display: flex;
  flex-direction: column;
`

const Controls = styled.div.attrs({
    className: 'm-2 ml-5'
})`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

const StyledSelect = styled.select`
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

const StyledButton = styled.button`
  position: relative;
  border-radius: 4px;
  border: 1px solid whitesmoke;
  background-color: yellowgreen;
  padding: 4px;
  color: white;
  font-weight: 600;
  align-self: flex-end;
  z-index: 310;
  ${({animation}) => (
    animation && css`
      animation: ${pulse} 300ms linear alternate infinite;
  `
)}

  ${({second}) => (
    second && css`
    position: static;
`
)}
`

const Hide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.75;
  z-index: 300;
`

const Aureole = styled.div`
  position: absolute;
  width: 120%;
  height: 200%;
  border-radius: 16px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  z-index: 305;
`

const CarService = () => {
    const [numbersByCar, setNumbersByCar] = useState([])
    const [number, setNumber] = useState(9);
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [openPermWindow, setOpenPermWindow] = useState(false)
    const [restriction, setRestriction] = useState(true)

    const history = useHistory();

    const cars = useSelector(state => state.cars.navifleetCars)
    const {alerts, adminPermission, permission} = useContext(CarServiceDataContext);

    const automobiles = useSelector(state => state.cars.cars)

    const {permissions, setPermissions, userPermissions,} = useContext(CarServiceDataContext);

    const [cookies,] = useCookies();

    const getUniqueIds = (array) => {
        const ids = array.map(item => item.automobile_id);
        const uniqueIds = new Set(ids);

        return [...uniqueIds]
    }

    const getNumberPlateById = (ids, cars) => {
        const numberPlates = [];
        cars.forEach(item => {
            if (ids.includes(item.id)) {
                numberPlates.push(item.numberPlate)
            }
        })
        setNumbersByCar(numberPlates)
    }

    const divideCars = (array, partsNumber) => {
        const dividedArray = [];

        if (array.length) {
            let booksToDivide = [...array];
            while (booksToDivide.length) {
                const part = booksToDivide.slice(0, partsNumber)
                booksToDivide.splice(0, partsNumber)
                dividedArray.push(part);
            }
        }
        return dividedArray.length ? dividedArray : [[]];
    }

    useEffect(() => {
        getNumberPlateById(getUniqueIds(alerts), automobiles)
    }, [cars, alerts])

    const carData = useMemo(() => {
            return cars.filter(item => removeWhiteChart(item.license).toUpperCase().includes(filter.toUpperCase()))
        }
        , [cars, filter])

    const dividedCars = divideCars(carData, number)

    const handleOpen = useCallback(() => {
        setOpen(!open)
    }, [open])

    const getAlertRestrictions = handleErrorApi(async () => {
        const data = await getData('/alertPeriod', cookies)
        setRestriction(data.data)
    })
    useEffect(() => {
        getAlertRestrictions();
    }, [])

    const handleOpenWindowPerm = useCallback(() => {
        setOpenPermWindow(!openPermWindow)
    }, [openPermWindow])

    const findNumberPlateByUserId = (automobiles, cookies) => {
        const car = automobiles.find(car => car.user_id === parseInt(cookies.userId))
        return car ? removeWhiteChart(car.numberPlate) : ''
    }

    const displayCars = () => {
        if (adminPermission || permission.admin || permission.warehouseman) {
            const cars = dividedCars[page - 1] ? dividedCars[page - 1] : dividedCars[dividedCars.length -1]
            return cars.map((car, i) => (
                <Car key={car.id} index={i} {...car}/>
            ))
        } else if (permission.driver) {
            const numberPlate = findNumberPlateByUserId(automobiles, cookies)

            return carData
                .filter(car => removeWhiteChart(car.license) === numberPlate)
                .map(car => <Car key={car.id} index={0} {...car}/>)
        }
        return null;
    }

    const handlePages = useCallback(({target: {value}}) => {
        setNumber(value)
    }, [number])

    return (
        <Fragment>
            {cars.length ? (
                <Wrapper>
                    <TitleGroup>
                        <div className='d-flex flex-row align-items-center'>
                            <EmojiTransportationIcon style={{color: 'yellowgreen', fontSize: '40px'}}/>
                            <Title>Samochody geckonet</Title>
                        </div>

                        <div className='d-flex flex-row'>
                            {(adminPermission || permission.admin) ? (
                                <StyledButton
                                    second
                                    onClick={handleOpenWindowPerm}
                                >
                                    Uprawnienia
                                </StyledButton>
                            ) : null}

                            {(adminPermission || permission.admin || permission.warehouseman) ? (
                                <div style={{position: 'relative'}} className='ml-3'>
                                    <StyledButton
                                        onClick={handleOpen}
                                        animation={!restriction}
                                    >
                                        Ustaw interwały
                                    </StyledButton>
                                    <Aureole/>
                                </div>
                            ) : null}
                        </div>
                    </TitleGroup>

                    {(adminPermission || permission.admin || permission.warehouseman) ? (
                        <Controls>
                            <StyledSelect
                                defaultValue={9}
                                onChange={handlePages}
                            >
                                <option value={6}>6 samochodów</option>
                                <option value={9}>9 samochodów</option>
                                <option value={12}>12 samochodów</option>
                                <option value={cars.length}>wszystkie</option>
                            </StyledSelect>

                            <div className='m-1'/>

                            <Input
                                value={filter}
                                placeholder='filtruj po nr. rejestracyjnym'
                                onChange={({target: {value}}) => setFilter(value.trim())}
                            />
                        </Controls>
                    ) : null}

                    {(adminPermission || permission.admin || permission.warehouseman) ? (<LinksGroup>
                            {numbersByCar.map(number => (
                                <LinkAlert key={number} numberPlate={number}/>
                            ))}
                        </LinksGroup>
                    ) : null}

                    <CarsWrapper>
                        {displayCars()}
                    </CarsWrapper>

                    {(adminPermission || permission.admin || permission.warehouseman) ? (
                        <PaginationComponent
                            pagesNumber={dividedCars.length}
                            page={page}
                            setPage={setPage}
                        />
                    ) : null}

                    {!restriction && <Hide/>}
                </Wrapper>
            ) : (
                <CircularProgress style={{color: 'yellowgreen'}}/>
            )}

            <DraggableModal open={open} setOpen={setOpen}>
                <IntervalForm
                    restriction={restriction}
                    setRestriction={setRestriction}
                    setOpen={setOpen}
                />
            </DraggableModal>

            <DraggableModal open={openPermWindow} setOpen={setOpenPermWindow}>
                <PermissionController
                    addUrl='carPermission/add'
                    permissions={permissions}
                    setPermission={setPermissions}
                    deleteUrl='carPermission/delete'
                    putUrl='carPermission/update'
                    permissionUsers={userPermissions}
                />
            </DraggableModal>
        </Fragment>
    );
};

export default CarService;

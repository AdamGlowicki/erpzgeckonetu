import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Photo from "../carPhoto/Photo";
import PostAddIcon from "@material-ui/icons/PostAdd";
import CreditCardIcon from '@material-ui/icons/CreditCard';
import useCookies from "react-cookie/cjs/useCookies";
import {getData, handleErrorApi} from "../../../../common/apiMethods/apiMethods";

const StyledWrapper = styled.div.attrs({
    className: 'p-2'
})`
  position: relative;
  width: 100%;
  max-height: 100%;
  grid-area: registration;
  box-shadow: 7px 6px 16px -5px rgba(0,0,0,0.58);
  border: 2px solid whitesmoke;
  display: grid;

  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
  grid-row-gap: 14px;
  grid-template-areas:
  'registrationAvers registrationRvers'
  'carCard insurance'
  'licenceAvers licenceRevers'
  'doc null'
  ;
`

const CommonStyle = styled.div.attrs({
    className: 'p-2'
})`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 2px solid whitesmoke;
`

const RegistrationAvers = styled(CommonStyle)`
  grid-area: registrationAvers;
  border: 4px solid black;
  border-right: none;
  border-bottom: none;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0;
`

const RegistrationRevers = styled(CommonStyle)`
  grid-area: registrationRvers;
  border: 4px solid black;
  border-left: none;
  border-bottom: none;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;
`
const Insurance = styled(CommonStyle)`
  grid-area: insurance;
  border: 4px solid black;
  border-top: none;
  border-left: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;
`

const CarCard = styled(CommonStyle)`
  grid-area: carCard;

  border: 4px solid black;
  border-top: none;
  border-right: none;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;
`

const Doc = styled(CommonStyle)`
  grid-area: doc;

  border: 4px solid yellowgreen;
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`

const LicenceAvers = styled(CommonStyle)`
  grid-area: licenceAvers;
  border: 4px solid yellowgreen;
  border-right: none;
  border-bottom: none;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0;
`

const LicenceRevers = styled(CommonStyle)`
  grid-area: licenceRevers;
  border: 4px solid yellowgreen;
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

const CarDocTitle = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  font-size: 14px;
  font-weight: 500;
  transform: translateX(-50%);
  border: 2px solid black;
  padding: 2px;
  border-radius: 12px;
  z-index: 1;
  background-color: #fff;
`
const UserDocTitle = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  font-size: 14px;
  font-weight: 500;
  transform: translateX(-50%) translateY(80%);
  border: 2px solid yellowgreen;
  padding: 2px;
  border-radius: 12px;
  z-index: 1;
  color: yellowgreen;
  background-color: #fff;
`

const Photos = ({car, userId, photosData, setPhotosData}) => {
    const [userPhotos, setUserPhotos] = useState([])
    const [cookies, ] = useCookies();

    const getUsersPhotos = handleErrorApi(async(id, cookies) => {
        const data = await getData(`userPhoto/${id}`, cookies)
        setUserPhotos(data.data)
    })

    useEffect( () => {
        userId && getUsersPhotos(userId, cookies)
    }, [userId, photosData.licenceAvers, photosData.licenceRevers, photosData.doc])


    const getCarPhotoByType = (type, car) => {
        if (car) {
            return car.car_photo.find(photo => photo.type === type)
        }
        return null
    }

    const getUserPhotoByType = (type, photos) => {
        if (photos.length) {
            return photos.find(photo => photo.type === type)
        }
        return null
    }

    return (
        <StyledWrapper>
            <CarDocTitle>Część samochodowa</CarDocTitle>
            <UserDocTitle>Część użytkownika</UserDocTitle>

            <RegistrationAvers>
                <Photo
                    carId={car == null ? undefined : car.id}
                    type='avers'
                    title='Dowód rejestracyjny awers'
                    url='carPhoto'
                    photoData={photosData.registrationAvers}
                    setPhotoData={setPhotosData}
                    keyValue='registrationAvers'
                    photo={getCarPhotoByType('avers', car)}
                    icon={
                        <PostAddIcon
                            style={{color: 'yellowgreen'}}
                            fontSize='large'
                        />
                    }
                    deleteUrl='carPhoto'
                />
            </RegistrationAvers>

            <RegistrationRevers>
                <Photo
                    carId={car == null ? undefined : car.id}
                    type='revers'
                    title='Dowód rejestracyjny rewers'
                    url='carPhoto'
                    photoData={photosData.registrationRevers}
                    setPhotoData={setPhotosData}
                    keyValue='registrationRevers'
                    photo={getCarPhotoByType('revers', car)}
                    icon={
                        <PostAddIcon
                            style={{color: 'yellowgreen'}}
                            fontSize='large'
                        />
                    }
                    deleteUrl='carPhoto'
                />
            </RegistrationRevers>

            <Insurance>
                <Photo
                    carId={car == null ? undefined : car.id}
                    type='insurance'
                    title='Polisa Ubezpieczeniowa'
                    photo={getCarPhotoByType('insurance', car)}
                    url='carPhoto'
                    photoData={photosData.insurance}
                    keyValue='insurance'
                    setPhotoData={setPhotosData}
                    icon={
                        <PostAddIcon
                            style={{color: 'yellowgreen'}}
                            fontSize='large'
                        />
                    }
                    deleteUrl='carPhoto'
                />
            </Insurance>

            <CarCard>
                <Photo
                    carId={car == null ? undefined : car.id}
                    type='carCard'
                    title='Karta pojazdu'
                    photo={getCarPhotoByType('carCard', car)}
                    url='carPhoto'
                    photoData={photosData.carCard}
                    keyValue='carCard'
                    setPhotoData={setPhotosData}
                    icon={
                        <PostAddIcon
                            style={{color: 'yellowgreen'}}
                            fontSize='large'
                        />
                    }
                    deleteUrl='carPhoto'
                />
            </CarCard>

            <LicenceAvers>
                <Photo
                    type='avers'
                    title='Prawo jazdy awers'
                    userId={userId}
                    setUserPhotos={setUserPhotos}
                    photo={getUserPhotoByType('avers', userPhotos)}
                    url='userPhoto'
                    photoData={photosData.licenceAvers}
                    setPhotoData={setPhotosData}
                    keyValue='licenceAvers'
                    deleteUrl='userPhoto'
                    icon={
                        <CreditCardIcon
                            style={{color: 'yellowgreen'}}
                            fontSize='large'
                        />
                    }
                />
            </LicenceAvers>

            <LicenceRevers>
                <Photo
                    type='revers'
                    title='Prawo jazdy rewers'
                    userId={userId}
                    setUserPhotos={setUserPhotos}
                    photo={getUserPhotoByType('revers', userPhotos)}
                    url='userPhoto'
                    photoData={photosData.licenceRevers}
                    setPhotoData={setPhotosData}
                    keyValue='licenceRevers'
                    deleteUrl='userPhoto'
                    icon={
                        <CreditCardIcon
                            style={{color: 'yellowgreen'}}
                            fontSize='large'
                        />
                    }
                />
            </LicenceRevers>

            <Doc>
                <Photo
                    type='doc'
                    title='Dokument o zdolności kierowania pojazdem mechanicznym'
                    userId={userId}
                    setUserPhotos={setUserPhotos}
                    photo={getUserPhotoByType('doc', userPhotos)}
                    url='userPhoto'
                    photoData={photosData.doc}
                    setPhotoData={setPhotosData}
                    keyValue='doc'
                    deleteUrl='userPhoto'
                    icon={
                        <CreditCardIcon
                            style={{color: 'yellowgreen'}}
                            fontSize='large'
                        />
                    }
                />
            </Doc>
        </StyledWrapper>
    );
};

export default Photos;

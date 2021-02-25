import React, {Fragment, useContext, useEffect, useState} from 'react';
import styled, {css} from 'styled-components';
import MyDropZone from "../../../molecules/dropZone/DropZone";
import {getFile, handleErrorApi, deleteData} from "../../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import AcceptWindow from "../../../molecules/acceptWindow/AcceptWindow";
import {useDispatch} from "react-redux";
import {fetchCars} from "../../../../reducers/car";
import {CarServiceDataContext} from "../carServiceRouter/CarServiceRouter";

const StyledWrapper = styled.div.attrs({
    className: 'p-1'
})`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 7px 6px 16px -5px rgba(0,0,0,0.58);
  border: 1px solid whitesmoke;
  border-radius: 8px;
`

const StyledAddPhotoIcon = styled.div`
  position: absolute;
  left: 8px;
  bottom: 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
`

const StyledPhoto = styled.img`
  max-height: 220px;
  max-width: 100%;
  object-fit: contain;
  border-radius: 8px;

  ${({second}) => (
      second && css`
      max-height: 100%;
  `
)}
`

const StyledButton = styled.button`
  position:absolute;
  bottom: 0;
  right: 0;
  margin: 4px;
  border-radius: 4px;
  border: 1px solid whitesmoke;
  background-color: yellowgreen;
  padding: 4px;
  color: white;
  font-weight: 600;
  align-self: flex-end;
  ${({second}) => (
    second && css`
      background-color: red;
  `
)}
`

const Info = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
  min-width: 80%;
  transform: translateX(-50%);
  background-color: black;
  color: whitesmoke;
  border-radius: 4px;
  padding: 4px;
  font-size: 16px;
  text-transform: uppercase;
  text-align: center;
`

const Title = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 12px;
  font-weight: 500;
`

const Photo = ({setPhotoData, photoData, url, deleteUrl, icon, photo: propsPhoto, title, userId, type, setUserPhotos, keyValue, carId, second}) => {
    const [photo, setPhoto] = useState(null)
    const [open, setOpen] = useState(false);
    const [cookies,] = useCookies();

    const dispatch = useDispatch();

    const {adminPermission, permission} = useContext(CarServiceDataContext);

    const getPicture = handleErrorApi(async (url, id, type) => {
        const data = await getFile(`${url}/${id}/${type}`, cookies)
        setPhoto(data.data)
    })

    useEffect(() => {
        if (!photo && url && propsPhoto) {
            getPicture(url, userId ? userId : carId, type)
        }
    }, [photo, url, propsPhoto, userId, carId])

    useEffect(() => {
        if (!propsPhoto) {
            setPhoto(null)
        }
    }, [userId, propsPhoto])


    const displayPhoto = () => {
        if (photo) {
            return URL.createObjectURL(photo)
        } else if (photoData) {
            return URL.createObjectURL(photoData)
        } else {
            return undefined
        }
    }

    const handleUploadPhoto = (file) => {
        const imageMatcher = /^image/;
        const sizeMatcher = 5242880; //5mb

        if (imageMatcher.test(file[0].type) && file[0].size < sizeMatcher) {
            setPhotoData({[keyValue]: file[0]})
        } else if (file[0].size >= sizeMatcher) {
            alert('Za duży plik, maksymalnie 5mb')
        } else {
            alert('Nieprawidłowy format pliku')
        }
    }

    const handleRemovePhoto = () => {
        if (photoData) {
            setPhotoData({[keyValue]: null})
        } else if (photo) {
            setOpen(true)
        }
    }

    const asyncDeletePhoto = handleErrorApi(async (carId, deleteUrl, cookies) => {
        setOpen(prev => !prev)
        await deleteData(`${deleteUrl}/${carId}/${type}`, cookies)

        userId ? (setUserPhotos(prev => {
            return prev.filter(photo => photo.type !== type)
        })) : (
            await dispatch(fetchCars(cookies))
        )
        setPhoto(null)
    })

    const handleDownloadFile = async () => {
        if (adminPermission || permission.admin) {
            const photoUrl = url
            try {
                const result = await getFile(`${photoUrl}/${userId ? userId : carId}/${type}`, cookies)

                const headers = new Headers(result.headers);
                const disposition = headers.get('content-disposition');
                const name = disposition.substring(disposition.lastIndexOf('=') + 1)

                const url = window.URL.createObjectURL(new Blob([result.data], { type:'application/pdf' }));
                let link = document.createElement('a');
                link.href = url;
                link.download = name;
                link.click();

            } catch (e) {
            }
        }
    };

    return (
        <Fragment>
            <StyledWrapper>
                <Title>{title}</Title>

                {photo || photoData ? (
                    <div onClick={handleDownloadFile} style={{cursor: 'pointer'}}>
                        <StyledPhoto second={second} src={displayPhoto()} alt='Jakis samochód'/>
                    </div>
                ) : (
                    (adminPermission || permission.admin || permission.warehouseman) ? (
                        <Fragment>
                            <MyDropZone arrowSize={80} callback={handleUploadPhoto}/>

                            <StyledAddPhotoIcon>
                                {icon}
                            </StyledAddPhotoIcon>
                        </Fragment>
                    ) : null
                )}

                {(photo || photoData) && (
                    (adminPermission || permission.admin || permission.warehouseman) ? (
                        <StyledButton
                            onClick={handleRemovePhoto}
                            second
                        >
                            Usuń
                        </StyledButton>
                    ) : null
                )}

                {photoData && <Info>Zdjęcie jeszcze nie jest zapisane</Info>}
            </StyledWrapper>

            <AcceptWindow
                open={open}
                handleClose={setOpen}
                handleApproved={() => asyncDeletePhoto(userId ? userId : carId, deleteUrl, cookies)}
            >
                Czy na pewno chcesz usunąć to zdjęcie?
            </AcceptWindow>
        </Fragment>

    );
};

export default Photo;

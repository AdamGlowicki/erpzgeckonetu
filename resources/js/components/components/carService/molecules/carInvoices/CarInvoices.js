import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import File from "../../../globalComponents/file/File";
import MyDropZone from "../../../molecules/dropZone/DropZone";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import ScannerRoundedIcon from '@material-ui/icons/ScannerRounded';
import {CarServiceDataContext} from "../carServiceRouter/CarServiceRouter";
import Countdown from "react-countdown";
import {
    getData,
    handleErrorApi,
    handleErrorFileUpload,
    postData,
    postFile
} from "../../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {CarContext} from "../carDetail/CarDetail";

const StyledWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Area = styled.div`
  display: grid;
  height: 100%;
  grid-auto-columns: 3fr 2fr;
  grid-template-areas:
    'files upload'
  ;
`

const Files = styled.div.attrs({
    className: 'p-2'
})`
  grid-area: files;
  width: 100%;
  height: 100%;
  max-height: 300px;
`

const FileContent = styled.div.attrs({
    className: 'pl-3 pt-3'
})`
  border-radius: 8px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 7px 6px 16px -5px rgba(0,0,0,0.58);
  overflow-y: scroll;

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

const Upload = styled.div.attrs({
    className: 'p-2'
})`
  grid-area: upload;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const UploadContent = styled.div`
  position: relative;
  border-radius: 8px;
  width: 100%;
  flex-grow: 1;
  box-shadow: 7px 6px 16px -5px rgba(0,0,0,0.58);
`

const Title = styled.div.attrs({
    className: 'mt-2 mb-1 ml-3'
})`
  font-size: 16px;
  font-weight: 600;
`

const AddIcon = styled(NoteAddIcon)`
  color: yellowgreen;
  position: absolute;
  left: 16px;
  bottom: 16px;
`

const Button = styled.button`
  background-color: yellowgreen;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
`

const CarInvoices = ({car = {}}) => {
    const [invokes, setInvokes] = useState([])

    const {
        setAlert: contextSetAlert
    } = useContext(CarServiceDataContext);

    const {setAlert} = useContext(CarContext);

    const [cookies,] = useCookies();

    const getMail = handleErrorApi(async (time, automobile_id, code, cookies) => {
        const data = await postData('/automobiles/attachments', {time: time, automobile_id, code,}, cookies);
        setInvokes(data.data)
        contextSetAlert({open: false})
    }, err => {
        if  (err.response.status === 404) {
            contextSetAlert({open: false})
            setAlert({open: true, message: 'Coś poszło nie tak, spróbuj ponownie za chwilę.'})

        }
    })

    const getInvokes = handleErrorApi(async (url, cookies) => {
        const data = await getData(url, cookies)
        setInvokes(data.data)
    })

    useEffect(() => {
        getInvokes(`carInvokesByCar/${car.id}`, cookies)
    }, [])

    const saveFile = handleErrorFileUpload(async (file) => {
        const postData = new FormData()
        postData.append('invoke', file[0])
        postData.append('automobile_id', car.id)
        const data = await postFile('/carInvoke', postData, cookies)
        setInvokes(data.data)
    }, (err) => {
        if (err.response.status === 422) {
            setAlert({open: true, message: 'Niewłaściwy format pliku, możesz dodać tylko pdf.'})
        }
    })

    const format = ({minutes, seconds}) => {
        const formatMinutes = minutes <= 9 ? `0${minutes}` : minutes
        const formatSeconds = seconds <= 9 ? `0${seconds}` : seconds
        return (
            <div>
                {formatMinutes}:{formatSeconds}
            </div>
        )
    }

    const generateCode = () => {
        return Math.floor(Math.random() * (999 - 100 + 1) + 100)
    }

    const message = (code) => (
        <div className='d-flex flex-row' style={{fontSize: '16px'}}>
            <div className='mr-2' style={{fontWeight: 700}}>
                Kod: {code}
            </div>
            <div>
                Wpisz ten kod jak tytuł do maila
            </div>
            <div className='ml-2'>
                <Countdown
                    date={Date.now() + 180000}
                    intervalDelay={0}
                    precision={3}
                    renderer={format}
                />
            </div>
        </div>
    )

    const handleScan = async () => {
        const code = generateCode()
        contextSetAlert({ms: 180000, open: true, type: 'success', message: message(code)})
        await getMail(3, car.id, code, cookies)
    }

    return (
        <StyledWrapper>
            <Title>Faktury</Title>
            <Area>
                <Files>
                    <FileContent>
                        {invokes.map(file => (
                            <File
                                key={file.id}
                                file={file}
                                deleteUrl={'/carInvoke'}
                                downloadUrl='/carInvoke'
                                removeCallback={setInvokes}
                            />
                        ))}
                    </FileContent>
                </Files>

                <Upload>
                    <UploadContent>
                        <MyDropZone arrowSize={50} callback={saveFile}/>
                        <AddIcon/>
                    </UploadContent>
                    <div className='pt-2 pb-1'>
                        <Button onClick={handleScan}>
                            <ScannerRoundedIcon style={{color: 'white'}}/>
                            <div className='ml-2'>
                                Skanuj
                            </div>
                        </Button>
                    </div>
                </Upload>
            </Area>
        </StyledWrapper>
    );
};

export default CarInvoices;

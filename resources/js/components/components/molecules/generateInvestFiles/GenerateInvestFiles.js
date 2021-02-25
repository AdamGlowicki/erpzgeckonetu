import React, {Fragment, useState} from 'react';
import MyDropZone from "../dropZone/DropZone";
import CellWithFiles from "../cellWithFiles/CellWithFiles";
import {useCookies} from "react-cookie";
import {postFile} from "../../../common/apiMethods/apiMethods";
import {useDispatch} from "react-redux";
import {ADD_INVEST_FILE, IS_ERROR, IS_LOADING} from "../../../reducers/investments/duck/reduxType";
import styled from "styled-components";
import StartScan from "../startScan/StartScan";
import DraggableModal from "../draggableModal/DraggableModal";
import SetTimeForm from "../setTimeForm/SetTimeForm";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const DragZoneWrapper = styled.div`
    border: 1px solid #cdd;
    border-radius: 3px;
    height: 150px;
`

const GenerateInvestFiles = ({stage}) => {

    const [cookies, setCookie] = useCookies(['name'])

    const [open, setOpen] = useState(false)

    const setError = useDispatch();
    const setLoading = useDispatch();
    const saveFile = useDispatch();


    const handleDropdown = async (file) => {
        const formdata = new FormData();
        formdata.append("invest", file[0]);
        formdata.append('invest_id', stage.id);

        setLoading({type: IS_LOADING, payload: true});
        try {
            const result = await postFile('/investFile', formdata, cookies);
            saveFile({
                type: ADD_INVEST_FILE,
                payload: {file: file[0], stageId: stage.id, id: result.data.id, data: result.data.data}
            })
        } catch (e) {
            setLoading({type: IS_LOADING, payload: false});
            setError({
                type: IS_ERROR,
                payload: {isError: true, errorMessage: `Nie udało się dodać pliku ${file[0].name}.`}
            })
        }
        setLoading({type: IS_LOADING, payload: false});
    };

    return (
        <Fragment>
            <StyledWrapper>
                <div>
                    <DragZoneWrapper>
                        <MyDropZone callback={handleDropdown} arrowSize={70}/>
                    </DragZoneWrapper>
                    <StartScan withBackground size='small' big setOpen={setOpen}/>
                </div>

                <div className='d-flex flex-row flex-wrap'>
                    {stage.files && stage.files.map(file => (
                        <CellWithFiles stageId={stage.id} {...file} key={file.id}/>))}
                </div>
            </StyledWrapper>

            <DraggableModal open={open} setOpen={setOpen}>
                <SetTimeForm setOpen={setOpen} placeName={`teczki: ${stage.stage_name}`} place='investFiles' stage_id={stage.id}/>
            </DraggableModal>
        </Fragment>
    );
};

GenerateInvestFiles.propTypes = {};

export default GenerateInvestFiles;

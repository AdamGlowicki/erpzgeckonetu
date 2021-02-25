import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import File from "../../foldersFilesArea/file/File";
import {FilePlace} from "../../../../enums/files/filePlace";
import MyDropZone from "../../dropZone/DropZone";
import TableCell from "@material-ui/core/TableCell";
import {postFile} from "../../../../common/apiMethods/apiMethods";
import {DragTypes} from "../../../../enums/dragTypes";
import {useCookies} from "react-cookie";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {IS_ERROR, IS_LOADING, UPLOAD_FILE_TO_TABLE} from "../../../../reducers/investments/duck/reduxType";
import StartScan from "../../startScan/StartScan";
import SetTimeForm from "../../setTimeForm/SetTimeForm";
import DraggableModal from "../../draggableModal/DraggableModal";

const useStyles = makeStyles(theme => ({
    root: {
        border: 0,
        color: 'black',
        height: '300px',
        padding: '0 30px',

    },
    animated: {
        fontSize: '10px',
        width: '84%'
    },
    smallSize: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        background: ({background}) => background,
    }
}));

const PostFile = ({id, post_files, taskId, stageId, taskName, rowColor}) => {
    const [cookies, setCookie] = useCookies(['name'])
    const [open, setOpen] = useState(false);

    const classes = useStyles({background: rowColor});

    const setLoading = useDispatch()
    const setError = useDispatch()
    const saveFile = useDispatch()

    const handlePostFileDragdown = async (file) => {
        const formData = new FormData()
        formData.append('post', file[0])
        formData.append('body_id', id)
        setLoading({type: IS_LOADING, payload: true});

        try {
            const response = await postFile('/postFile', formData, cookies);
            const {id: resId, data} = response.data;
            saveFile({type: UPLOAD_FILE_TO_TABLE, payload: {file: file[0], type: DragTypes.POST_FILES_ON_TABLE, rowId: id, id: resId, data, taskId, stageId}})

        } catch (e) {
            setLoading({type: IS_LOADING, payload: false});
            setError({type: IS_ERROR, payload: {isError: true, errorMessage: `Nie udało się dodać pliku ${file[0].name}`}})
        }
        setLoading({type: IS_LOADING, payload: false});
    };
    return (
        <TableCell className={classes.smallSize}>
            <div className='d-flex flex-row justify-content-end'>
                <div className='d-flex flex-column'>
                    {post_files && post_files.map(file => (
                        <File key={file.id}
                              stageId={stageId}
                              taskId={taskId}
                              file={{...file, place: FilePlace.TABLE_POST, rowId: id}}/>))}
                </div>
                <div className='d-flex'>
                    <MyDropZone callback={handlePostFileDragdown}/>
                    <StartScan size='small' setOpen={setOpen}/>
                </div>
            </div>

            <DraggableModal open={open} setOpen={setOpen}>
                <SetTimeForm setOpen={setOpen} placeName={`etapu: ${taskName} wysłanych plików`} body_id={id} place='postFile'/>
            </DraggableModal>
        </TableCell>
    );
};

PostFile.propTypes = {

};

export default PostFile;

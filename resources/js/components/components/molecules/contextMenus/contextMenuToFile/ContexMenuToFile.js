import React, {useState} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import {FileExtensions} from '../../../../enums/fileExtensions';
import PreviewPdfFile from '../../previewpdfFile/PreviewPdfFile';
import MyFileViewer from '../../fileViewer/MyFileViewer';

const initialState = {
    mouseX: null,
    mouseY: null,
};

const checkType = (type) => (
    (type === FileExtensions.WORD) || (type === FileExtensions.TXT) || (type === FileExtensions.CSV) || (type === FileExtensions.AUTO_CAD) || (type === FileExtensions.SHP) || (FileExtensions.PICTURE.includes(type)) || (FileExtensions.EXCEL.includes(type))
);

const ContextMenuToFile = ({children, postfix, handleRemoveFile, setOpenPdf, setOpenFile}) => {
    const [state, setState] = React.useState(initialState);

    const handleClick = (event) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const removeFileHandler = () => {
        handleRemoveFile();
        setState(initialState);
    };


    const handleClose = () => {
        setState(initialState);
    };

    const handleShowPdf = () => {
        setOpenPdf(true);
        setState(initialState);
    };

    const handleShowFile = () => {
        setOpenFile(true);
        setState(initialState);
    };

    return (
        <React.Fragment>
            <div onContextMenu={handleClick} style={{cursor: 'context-menu'}}>
                <Typography component='div'>
                    {children}
                </Typography>
                <Menu
                    keepMounted
                    open={state.mouseY !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        state.mouseY !== null && state.mouseX !== null
                            ? {top: state.mouseY, left: state.mouseX}
                            : undefined
                    }
                >
                    <MenuItem onClick={removeFileHandler}>Usuń</MenuItem>
                    {postfix === FileExtensions.PDF && (<MenuItem onClick={handleShowPdf}>Podgląd pliku</MenuItem>)}
                    {checkType(postfix) && (<MenuItem onClick={handleShowFile}>Podgląd Pliku</MenuItem>)}
                </Menu>
            </div>
        </React.Fragment>
    );
};


ContextMenuToFile.propTypes = {
    removeDocument: PropTypes.func,
    id: PropTypes.number,
    rowId: PropTypes.number,
    stageId: PropTypes.number,
    name: PropTypes.string,
    place: PropTypes.string,
    postfix: PropTypes.string,
};

export default ContextMenuToFile;

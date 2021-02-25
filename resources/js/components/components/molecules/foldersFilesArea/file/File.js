import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import autoCad from '../../../../common/icons/autocad.jpg'
import csv from '../../../../common/icons/csv.png'
import excel from '../../../../common/icons/excel.png'
import image from '../../../../common/icons/image.png'
import pdf from '../../../../common/icons/pdf.png'
import shp from '../../../../common/icons/shp.jpg'
import txt from '../../../../common/icons/txt.jpg'
import word from '../../../../common/icons/word.png'
import {FileExtensions} from '../../../../enums/fileExtensions';
import styled from 'styled-components';
import {displayPopover, limitString, setError, setLoading} from '../../../../common/globalMethods';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import ContextMenuToFile from '../../contextMenus/contextMenuToFile/ContexMenuToFile';
import {connect} from 'react-redux';
import {REMOVE_DOCUMENT} from '../../../../reducers/investments/duck/reduxType';
import AcceptWindow from '../../acceptWindow/AcceptWindow';
import {FilePlace} from '../../../../enums/files/filePlace';
import {deleteData, getFile} from '../../../../common/apiMethods/apiMethods';
import {useCookies} from "react-cookie";
import PreviewPdfFile from "../../previewpdfFile/PreviewPdfFile";
import MyFileViewer from "../../fileViewer/MyFileViewer";

const StyledWrapper = styled.div.attrs({
    className: 'm-1'
})`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledIcon = styled.div`
  background-image: url(${({background}) => background});
  background-size: cover;
  width: 20px;
  height: 20px;
`;

const useStyles = makeStyles(theme => ({
    root: {
        marginLeft: theme.spacing(1),
        padding: 0,
        fontSize: 10
    },
}));

const removeDocument = (data) => ({
    type: REMOVE_DOCUMENT,
    payload: data
});

const File = ({file, stageId, taskId, folderId, removeDocument, setLoading, setError}) => {
    const classes = useStyles();
    const [openApprovedWindow, setOpenApprovedWindow] = useState(false);
    const [stateUrl, setStateUrl] = useState('');
    const [openPdf, setOpenPdf] = useState(false);
    const [openFile, setOpenFile] = useState(false);
    const [fileData, setFileData] = useState(null);
    const [extension, setExtension] = useState('');

    const [cookies, setCookie] = useCookies(['name']);

    const setUrl = (place, id) => {
        switch (place) {
            case FilePlace.CELL:
                setStateUrl(`/investFile/${id}`);
                break;
            case FilePlace.FOLDER:
                setStateUrl(`/folderFile/${id}`);
                break;
            case FilePlace.TABLE_POST:
                setStateUrl(`/postFile/${id}`);
                break;
            case FilePlace.TABLE_PREV:
                setStateUrl(`/prevFile/${id}`);
                break;
            case FilePlace.TABLE_SECOND:
                setStateUrl(`/secondFile/${id}`)
                break;
            case FilePlace.TABLE_SECOND_POST:
                setStateUrl(`/postSecondFile/${id}`)
                break;
            case FilePlace.AGREEMENTS:
                setStateUrl(`/agreementFile/${id}`)
                break;
            default:
                setStateUrl('')
        }
    }

    useEffect(() => {
        setUrl(file.place, file.id);
    }, [file.place])

    const getPostFix = (str) => {
        if (str) {
            return str.substr(str.lastIndexOf('.'))
        }
        return '';
    };

    const returnIfExist = (arr, ext) => (
        arr.includes(ext) && ext
    );

    const getIconByFileName = (postfix) => {
        switch (postfix) {
            case FileExtensions.AUTO_CAD:
                return autoCad;
            case FileExtensions.CSV:
                return csv;
            case returnIfExist(FileExtensions.EXCEL, postfix):
                return excel;
            case FileExtensions.PDF:
                return pdf;
            case FileExtensions.SHP:
                return shp;
            case FileExtensions.TXT:
                return txt;
            case FileExtensions.WORD:
                return word;
            case returnIfExist(FileExtensions.PICTURE, postfix):
                return image;
        }
    };

    const handleDownloadFileToPreview = async () => {
        setLoading(true)
        try {
            const result = await getFile(stateUrl, cookies);
            const url = window.URL.createObjectURL(new Blob([result.data], ));
            const headers = new Headers(result.headers);
            const disposition = headers.get('content-disposition');
            const extension = disposition.substring(disposition.lastIndexOf('.') + 1)
            setExtension(extension);
            setFileData(url);
        } catch (e) {
            setLoading(false);
            setError({isError: true, errorMessage: 'Nie da sie podejżeć pliku.'})
        }
        setLoading(false)
    }

    const handleDownloadFile = async () => {
        setLoading(true);
        try {
            const result = await getFile(stateUrl, cookies)
            const headers = new Headers(result.headers);
            const disposition = headers.get('content-disposition');
            const name = disposition.substring(disposition.lastIndexOf('=') + 1)

            const url = window.URL.createObjectURL(new Blob([result.data], { type:'application/pdf' }));
            let link = document.createElement('a');
            link.href = url;
            link.download = name;
            link.click();

        } catch (e) {
            setLoading(false);
            setError({isError: true, errorMessage: 'Nie udało sie pobrać pliku.'})
        }
        setLoading(false)
    };


    const handleRemove = () => {
        if (file.place === FilePlace.CELL) {
            removeDocument({id: file.id, stageId: file.stageId, place: file.place});
        } else {
            removeDocument({id: file.id, rowId: file.rowId, place: file.place, stageId, taskId, folderId});
        }
    };

    const asyncRemoveFile = async () => {
        setLoading(true);
        try {
            await deleteData(stateUrl, cookies);
            handleRemove();
        } catch (e) {
            setLoading(false);
            setError({isError: true, errorMessage: `Nie udało się usunąć ${file.name}`})
        }
        setOpenApprovedWindow(false);
        setLoading(false)
    };

    const handleOpenPdf = async() => {
        await handleDownloadFileToPreview()
        setOpenPdf(true)
    }

    const handleOpenFile = async() => {
        await handleDownloadFileToPreview();
        setOpenFile(true);
    }

    return (
        <React.Fragment>
            <div className='d-flex flex-row justify-content-center p-1 rounded '>
                {displayPopover(file.name, 15) ? (
                    <React.Fragment>
                        <ContextMenuToFile
                            postfix={getPostFix(file.name)}
                            handleRemoveFile={() => setOpenApprovedWindow(true)}
                            setOpenFile={handleOpenFile}
                            setOpenPdf={handleOpenPdf}
                        >
                            <Tooltip title={file.name} placement="top">
                                <Button className={classes.root} onClick={handleDownloadFile}>
                                    <StyledWrapper>
                                        {getIconByFileName(getPostFix(file.name)) && (
                                            <StyledIcon background={getIconByFileName(getPostFix(file.name))}/>
                                        )}
                                        <div className='ml-1'>{limitString(file.name, 15)}</div>
                                    </StyledWrapper>
                                </Button>
                            </Tooltip>
                        </ContextMenuToFile>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <ContextMenuToFile
                            postfix={getPostFix(file.name)}
                            handleRemoveFile={() => setOpenApprovedWindow(true)}
                            setOpenFile={handleOpenFile}
                            setOpenPdf={handleOpenPdf}
                        >
                            <Button className={classes.root} onClick={handleDownloadFile}>
                                <StyledWrapper>
                                    {getIconByFileName(getPostFix(file.name)) && (
                                        <StyledIcon background={getIconByFileName(getPostFix(file.name))}/>
                                    )}
                                    <div className='ml-1'>{limitString(file.name, 15)}</div>
                                </StyledWrapper>
                            </Button>
                        </ContextMenuToFile>
                    </React.Fragment>
                )}
            </div>
            <AcceptWindow
                open={openApprovedWindow}
                handleApproved={asyncRemoveFile}
                handleClose={setOpenApprovedWindow}
            >
                Czy na pewno chcesz usunąć plik {file.name} ?
            </AcceptWindow>
            <PreviewPdfFile isOpen={openPdf} setClose={setOpenPdf} file={fileData}/>
            <MyFileViewer isOpen={openFile} setClose={setOpenFile} file={fileData} extension={extension}/>
        </React.Fragment>
    );
};

File.propTypes = {
    file: PropTypes.object,
    removeDocument: PropTypes.func,
    setLoading: PropTypes.func,
    setError: PropTypes.func,
};

File.defaultProps = {
    file: {}
};

const mapDispatchToProps = dispatch => ({
    removeDocument: (data) => dispatch(removeDocument(data)),
    setError: data => dispatch(setError(data)),
    setLoading: data => dispatch(setLoading(data)),
});

export default connect(null, mapDispatchToProps)(File);

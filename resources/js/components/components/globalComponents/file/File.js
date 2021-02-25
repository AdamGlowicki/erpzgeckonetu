import React, {Fragment, useEffect, useState} from 'react';
import styled from 'styled-components';
import autoCad from "../../../common/icons/autocad.jpg";
import csv from "../../../common/icons/csv.png";
import excel from "../../../common/icons/excel.png";
import pdf from "../../../common/icons/pdf.png";
import shp from "../../../common/icons/shp.jpg";
import txt from "../../../common/icons/txt.jpg";
import word from "../../../common/icons/word.png";
import image from "../../../common/icons/image.png";
import {deleteData, getFile, handleErrorApi} from "../../../common/apiMethods/apiMethods";
import ContextMenu from "../../molecules/contextMenus/ContextMenu";
import {limitString} from "../../../common/globalMethods";
import MenuItem from "@material-ui/core/MenuItem";
import {useCookies} from "react-cookie";
import AcceptWindow from "../../molecules/acceptWindow/AcceptWindow";
import PreviewPdfFile from "../../molecules/previewpdfFile/PreviewPdfFile";

const Button = styled.button.attrs({
    className: 'p-2'
})`
  background-color: transparent;
  border: none;
  width: auto;

  :hover {
     background-color: yellowgreen;
     opacity: .5;
     border-radius: 8px;
  }

  :focus {outline: none;}
`

const Logo = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`

const File = ({file: propFile, deleteUrl, downloadUrl, removeCallback}) => {
    const [file, setFile] = useState({});
    const [open, setOpen] = useState(false);
    const [openPdf, setOpenPdf] = useState(false);
    const [fileData, setFileData] = useState(null)

    const [cookies,] = useCookies();

    useEffect(() => {
        propFile && setFile(propFile)
    }, [propFile])

    const extensions = {
        dwg: autoCad,
        bnp: image,
        jpeg: image,
        raw: image,
        jpg: image,
        png: image,
        pdf: pdf,
        xlsx: excel,
        xls: excel,
        docx: word,
        txt: txt,
        shp: shp,
        csv: csv,
    }

    const downloadFile = handleErrorApi(async (dldUrl, cookies) => {
        const result = await getFile(`${dldUrl}/${propFile.id}`, cookies)
        const headers = new Headers(result.headers);
        const disposition = headers.get('content-disposition');
        const name = disposition.substring(disposition.lastIndexOf('=') + 1)

        const url = window.URL.createObjectURL(new Blob([result.data], {type: 'application/pdf'}));
        let link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.click();
    })

    const handleDownloadFileToPreview = handleErrorApi(async (dldUrl, cookies) => {
        const result = await getFile(`${dldUrl}/${propFile.id}`, cookies);
        const url = URL.createObjectURL(new Blob([result.data],));
        setFileData(url);
    })

    const removeFile = handleErrorApi(async () => {
        setOpen(false)
        const data = await deleteData(`${deleteUrl}/${propFile.id}`, cookies)
        removeCallback(data.data)
    })

    const getPostFix = (str) => {
        if (str) {
            return str.substr(str.lastIndexOf('.') + 1)
        }
        return '';
    };

    const handleViewFile = (callback) => {
        handleDownloadFileToPreview(downloadUrl, cookies)
        setOpenPdf(true)
        callback()
    }

    const handleRemoveFile = (callback) => {
        setOpen(true)
        callback()
    }

    const menuItems = (callback) => {
        return [
            <MenuItem onClick={() => handleViewFile(callback)} key={1}>Podgląd</MenuItem>,
            <MenuItem onClick={() => handleRemoveFile(callback)} key={2}>Usuń</MenuItem>
        ]
    }

    return (
        <Fragment>
                <ContextMenu menuItems={menuItems}>
                    <Button onClick={() => downloadFile(downloadUrl, cookies)}>
                        <div className='d-flex flex-row justify-content-start'>
                            <div className='mr-2'>
                                <Logo src={extensions[getPostFix(file.name).toLowerCase()]} alt=''/>
                            </div>
                            <div>
                                {limitString(file.name, 15)}
                            </div>
                        </div>
                    </Button>
                </ContextMenu>

            <AcceptWindow
                open={open}
                handleClose={setOpen}
                handleApproved={removeFile}
            >
                Czy na pewno chcesz usunąć ten plik?
            </AcceptWindow>

            <PreviewPdfFile isOpen={openPdf} setClose={setOpenPdf} file={fileData}/>
        </Fragment>

    );
};

export default File;

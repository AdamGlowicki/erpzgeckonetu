import React, {Fragment, useState} from 'react';
import {ColorButton} from "../../atoms/colorButton/ColorButton";
import styled, {keyframes} from "styled-components";
import AssignmentIcon from '@material-ui/icons/Assignment';
import DraggableModal from "../draggableModal/DraggableModal";
import ClientAgreementsContent from "./ClientAgreementsContent";
import FolderContent from "./FolderContent";
import {useSelector} from "react-redux";

const move = keyframes`
  from {
    top: 0;
    right: 0;
    opacity: 0;
  }
  to {
    top: 8%;
    right: 4%;
    opacity: 1;
  }
`

const StyledWrapper = styled.div`
  position: fixed;
  top: 8%;
  right: 4%;
  animation: ${move} 1500ms;
`

const ClientAgreement = () => {
    const [open, setOpen] = useState(false);
    const [folderContent, setFolderContent] = useState([]);
    const folders = useSelector(state => state.agreements.agreementFolders)

    const closeModal = (id) => {
        const openedFolders = folderContent.filter(item => item.id !== id)
        setFolderContent(openedFolders)
    }

    return (
        <Fragment>
            <StyledWrapper>
                <ColorButton
                    startIcon={<AssignmentIcon/>}
                    onClick={() => setOpen(!open)}
                >
                    Dokumenty Przedinwestycyjne
                </ColorButton>
            </StyledWrapper>
            <DraggableModal open={open} setOpen={setOpen}>
                <ClientAgreementsContent
                    folderContent={folderContent}
                    setFolderContent={setFolderContent}
                />
            </DraggableModal>

            {folderContent && folderContent.map(item => {
                const folder = folders.filter(folder => folder.id === item.id)[0]
                return(
                        <DraggableModal key={item.id} open={true} close={() => closeModal(item.id)}>
                            <FolderContent name={folder.name}
                                           files={folder.agreement_files}
                                           folderId={item.id}/>
                        </DraggableModal>
                    )
                }
            )}
        </Fragment>
    );
};

export default ClientAgreement;

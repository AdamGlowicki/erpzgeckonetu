import React from 'react';
import PropTypes from 'prop-types';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import styled from 'styled-components';
import {Button} from 'react-bootstrap';
import {ADD_FOLDER} from '../../../../reducers/investments/duck/reduxType';
import {connect} from 'react-redux';
import {setError, setLoading} from '../../../../common/globalMethods';
import {postData} from '../../../../common/apiMethods/apiMethods';
import {useCookies} from "react-cookie";

const StyledNewFolder = styled.div`
  grid-column: span 1 / -1;
  grid-row: 1 / span 2;
  display: grid;
  justify-content: center;
  align-items: center;
  color: orange;
`;

const StyledButton = styled(Button).attrs({
    variant: 'link'
})`
  padding: 0;
  margin: 0;
`;

const addFolder = payload => ({
    type: ADD_FOLDER,
    payload
});

const CreateFolder = ({addFolder, setLoading, setError, id, stageId}) => {
    const [cookies, setCookie] = useCookies(['name']);

    const asyncAddFolder = async () => {
        setLoading(true);
        try {
            const data = {folder_name: 'Nowy folder', task_id: id};
            const result = await postData('/addFolder', data, cookies);
            addFolder({data: {id: result.data.id, isOpen: false, folder_name: result.data.folder_name}, ids: {taskId: id, stageId}})
        } catch (e) {
            setLoading(false);
            setError({isError: true, errorMessage: 'Nie udało się dodać nowego folderu'})
        }
        setLoading(false);
    };

    return (
        <StyledNewFolder>
            <StyledButton onClick={asyncAddFolder}>
                <CreateNewFolderIcon style={{color: 'orange'}}/>
            </StyledButton>
        </StyledNewFolder>
    );
};

const mapDispatchToProps = dispatch => ({
    addFolder: data => dispatch(addFolder(data)),
    setLoading: data => dispatch(setLoading(data)),
    setError: data => dispatch(setError(data)),
});

CreateFolder.propTypes = {
    addFolder: PropTypes.func,
    setLoading: PropTypes.func,
    setError: PropTypes.func,
}


export default connect(null, mapDispatchToProps)(CreateFolder);

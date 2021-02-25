import React, {useState} from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import RemoveIcon from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import {deleteData, putData} from "../../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {fetchGraphPermissions} from "../../../../reducers/graph/duck/operations";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`



const SingleUserPerm = ({checked: propsChecked, userId}) => {
    const [cookies,] = useCookies();
    const [checked, setChecked] = useState(propsChecked)
    const user = useSelector(state => state.user.users.filter(user => user.id === userId))[0]
    const dispatch = useDispatch()

    const handleChange = async(e) => {
        const {checked} = e.target
        setChecked(checked)
        try {
            await putData(`graphPermission/update/${userId}`, {permission: checked}, cookies)
            dispatch(fetchGraphPermissions(cookies))
        } catch (e) {}
    }

    const handleRemovePermission = async() => {
        try {
            await deleteData(`graphPermission/delete/${userId}`, cookies)
            dispatch(fetchGraphPermissions(cookies))
        } catch (e) {}
    }

    return (
        <StyledWrapper>
            <input
                className='mr-1'
                type="checkbox"
                checked={checked}
                onChange={handleChange}
            />

            <div>{user ? user.name : null}</div>

            <IconButton
                className='ml-1'
                size='small'
                style={{color: 'red'}}
                onClick={handleRemovePermission}
            >
                <RemoveIcon fontSize='small'/>
            </IconButton>
        </StyledWrapper>
    );
};

export default SingleUserPerm;

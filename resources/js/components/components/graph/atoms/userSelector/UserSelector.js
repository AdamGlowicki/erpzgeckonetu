import React, {Fragment} from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import {postData} from "../../../../common/apiMethods/apiMethods";
import {useCookies} from "react-cookie";
import {fetchGraphPermissions} from "../../../../reducers/graph/duck/operations";

const StyledSelect = styled.select.attrs({
    className: 'mb-2'
})`
  background-color: yellowgreen;
  border-radius: 8px;
  align-self: center;
`

const StyledTitle = styled.div`
  font-size: 12px;
  align-self: center;
  margin-bottom: 4px;
`

const UserSelector = () => {

    const [cookies,] = useCookies();
    const usersRedux = useSelector(state => state.user.users)
    const permissionUsers = useSelector(state => state.graph.permissions)
    const dispatch = useDispatch()

    const filterUserWithoutPermission = () => (
        usersRedux.filter(item => {
            return !permissionUsers.filter(permission => permission.user_id === item.id)[0]
        })
    )

    const selectUser = async(e) => {
        const {value} = e.target;
        try {
            await postData('/graphPermission/add', {user_id: value, permission: true}, cookies)
            dispatch(fetchGraphPermissions(cookies))
        } catch (e) {}
    }

    return (
        <Fragment>
            <StyledTitle>Dodaj Uprawnienia</StyledTitle>
            <StyledSelect onChange={selectUser}>
                {filterUserWithoutPermission().map(user => (
                    <option key={user.id} value={user.id} >{user.name}</option>
                ))}
            </StyledSelect>
        </Fragment>

    );
};

export default UserSelector;

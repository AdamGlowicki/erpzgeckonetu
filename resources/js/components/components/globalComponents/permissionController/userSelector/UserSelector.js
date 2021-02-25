import React, {Fragment, useState} from 'react';
import styled from 'styled-components';
import {useCookies} from "react-cookie";
import {useSelector} from "react-redux";
import {postData} from "../../../../common/apiMethods/apiMethods";

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

const UserSelector = ({permissions, addUrl, setPermissions, initPerm}) => {
    const [select, setSelect] = useState('default')
    const [cookies,] = useCookies();
    const users = useSelector(state => state.user.users)

    const filterUserWithoutPermission = () => (
        users.filter(item => {
            return !permissions.filter(permission => permission.user_id === item.id)[0]
        })
    )

    const selectUser = async(e) => {
        const {value} = e.target;
        setSelect('default')
        try {
            const data = await postData(addUrl, {user_id: value, ...initPerm}, cookies)
            setPermissions(data.data)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Fragment>
            <StyledTitle>Dodaj Uprawnienia</StyledTitle>
            <StyledSelect onChange={selectUser} value={select}>
                <option value={'default'} disabled> -- wybierz pracownika -- </option>
                {filterUserWithoutPermission().map(user => {
                    return <option key={user.id} value={user.id} >{user.name}</option>
                })}
            </StyledSelect>
        </Fragment>
    );
};

export default UserSelector;

import React, {Fragment} from 'react';
import styled from 'styled-components';
import SingleUserPerm from "../../atoms/singleUserPerm/SingleUserPerm";
import {useSelector} from "react-redux";
import UserSelector from "../../atoms/userSelector/UserSelector";

const StyledWrapper = styled.div`
  position: absolute;
  left: 4px;
  top: 4px;
  z-index: 9999;
  border-radius: 4px;
  background-color: whitesmoke;
  border: 1px solid grey;
  padding: 4px;
  display: flex;
  flex-direction: column;
`

const PermissionController = ({open}) => {
    const permissionUsers = useSelector(state => state.graph.permissions)

    return (
        <Fragment>
            {open ? (
                <StyledWrapper>
                    <UserSelector/>

                    {permissionUsers.map(user => (
                        <SingleUserPerm key={user.id} id={user.id} checked={user.permission} userId={user.user_id}/>
                    ))}
                </StyledWrapper>
            ) : null}
        </Fragment>
    );
};

export default PermissionController;

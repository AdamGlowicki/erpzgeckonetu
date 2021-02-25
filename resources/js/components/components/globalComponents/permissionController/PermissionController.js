import React, {Fragment} from 'react';
import styled from 'styled-components';
import SingleUserPerm from "./singleUserPerm/SingleUserPerm";
import UserSelector from "./userSelector/UserSelector";

const StyledWrapper = styled.div`
  border-radius: 4px;
  background-color: whitesmoke;
  padding: 4px;
  display: flex;
  flex-direction: column;
  min-width: 300px;
`

const LabelGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

const Label = styled.label`
   writing-mode: vertical-lr;
  text-orientation: mixed;
  font-size: 12px;
`

const PermissionController = ({permissions, putUrl, deleteUrl, addUrl, setPermission,}) => {
    return (
        <Fragment>
            <StyledWrapper>
                <UserSelector
                    permissions={permissions}
                    addUrl={addUrl}
                    setPermissions={setPermission}
                    initPerm={{warehouseman: false, driver: false, admin: false}}
                />

                <LabelGroup>
                    <Label>Magazynier</Label>
                    <Label>Kierowca</Label>
                    <Label>Administrator</Label>
                </LabelGroup>

                {permissions.map(perm => (
                    <SingleUserPerm
                        key={perm.id}
                        id={perm.id}
                        checked={{warehouseman: perm.warehouseman, driver: perm.driver, admin: perm.admin}}
                        userId={perm.user_id}
                        putUrl={putUrl}
                        deleteUrl={deleteUrl}
                        setPermissions={setPermission}
                    />
                ))}
            </StyledWrapper>
        </Fragment>
    );
};

export default PermissionController;

import React, {Fragment, useState} from 'react';
import styled from 'styled-components';
import Tab from "../tab/Tab";
import {useSelector} from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import PostAddIcon from '@material-ui/icons/PostAdd';
import DraggableModal from "../../../molecules/draggableModal/DraggableModal";
import TabContent from "../tabContent/TabContent";

const Nav = styled.nav.attrs({
    className: 'mb-2'
})`
  width: 100%;
`

const StyledUl = styled.ul`
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const Tabs = () => {
    const [open ,setOpen] = useState(false);
    const tabs = useSelector(state => state.graph.graph)

    const loggedUser = useSelector(state => state.user.user)
    const permissionUsers = useSelector(state => state.graph.permissions)
    const usersRedux = useSelector(state => state.user.users)

    const designerPermission = () => {
        const admins = ['admin', 'Mateusz Brzeski', 'Adam Głowicki', 'Radosław Sułkowski']
        const userIdsWitchPermissions = permissionUsers.filter(item => item.permission).map(item => item.user_id);
        const usersWithPermissions = usersRedux.filter(item => {
            return userIdsWitchPermissions.includes(item.id)
        }).map(item => item.name);

        const adminsAndUsers = [...admins, ...usersWithPermissions]

        return adminsAndUsers.includes(loggedUser);
    }

    return (
        <Fragment>
            <Nav>
                <StyledUl>
                    <div className='d-flex flex-row align-items-center'>
                        {tabs.map(tab => (
                            <Tab key={tab.id} id={tab.id} name={tab.name} permission={designerPermission()}/>
                        ))}
                    </div>

                    {designerPermission() && (<div className='ml-3'>
                        <IconButton
                            onClick={() => setOpen(!open)}
                            size='small'
                        >
                            <PostAddIcon fontSize='small' style={{color: 'yellowgreen'}}/>
                        </IconButton>
                    </div>)}
                </StyledUl>
            </Nav>

            <DraggableModal
                open={open}
                setOpen={setOpen}
            >
                <TabContent
                    name='Nowy'
                    id={null}
                    setOpen={setOpen}
                />
            </DraggableModal>
        </Fragment>

    );
};

export default Tabs;
